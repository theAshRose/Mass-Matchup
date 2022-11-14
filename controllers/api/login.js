const router = require("express").Router();
const { User } = require("../../models");
require('dotenv').config();
const rp = require('request-promise');

router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    req.session.user = dbUserData.id;
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: "Incorrect Username . Please try again!" });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect password. Please try again!" });
      return;
    }

    const fetchURL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.APIkey}&steamids=${dbUserData.steam_id}`;
    console.log(fetchURL);
    rp(fetchURL)
    .then(async (body) => {
      const playerData = JSON.parse(body).response.players[0];

      console.log(playerData);

      await User.update({
        steam_avatar_full: playerData.avatarfull,
        steam_username: playerData.personaname,
        profile_url: playerData.profileurl
      }, {
        where: {
          id: dbUserData.id
        }
      });

      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.privateProfile = playerData.communityvisibilitystate;
        req.session.username = dbUserData.username;
        req.session.steam_username = playerData.personaname;
        req.session.steam_avatar_full = playerData.avatarfull;
        req.session.profile_url = playerData.profileurl
        console.log(req.session.privateProfile, "HERE1")
        res
          .status(200)
          .json({ user: dbUserData, message: "You are now logged in!" });
      });
    })
    // res.redirect('/')
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
      const fetchURL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.APIkey}&steamids=${req.body.steam_id}`;
      console.log(fetchURL);
      rp(fetchURL)
      .then(async (body) => {
        const response = JSON.parse(body).response;

        const dbUserData = await User.create({
          username: req.body.username,
          password: req.body.password,
          steam_id: req.body.steam_id,
          steam_avatar_full: response.players[0].avatarfull,
          steam_username: response.players[0].personaname,
          profile_url: response.players[0].profileurl
        });

        req.session.user = dbUserData.id;
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.privateProfile = response.players[0].communityvisibilitystate;
          console.log(req.session.privateProfile, "HERE2")
          req.session.username = dbUserData.username;
          req.session.steam_username = dbUserData.steam_username;
          req.session.steam_avatar_full = dbUserData.steam_avatar_full;
          req.session.profile_url = dbUserData.profile_url;
          
          res.status(200).json(dbUserData);
      });
      })

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
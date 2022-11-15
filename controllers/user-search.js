const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require("dotenv").config();
const request = require("request");
var rp = require("request-promise");
const { parse } = require("handlebars");
const { getFriendsAndFriendRequests, authorizeUser } = require('../utils/middleware');

const { Op } = require("sequelize");

router.post("/results", async (req, res) => {
  
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      req.session.search = req.body.username;
      console.log(req.session.search + "string");
      res.status(200).json(req.body.username);
      //     console.log(req.body.username+"HERE")
      //   const userResults1 = await User.findAll({
      //     where: {
      //       username: req.body.username,
      //     },
      //   });
      //username:{ [Op.like]: `%${req.body.search}%` }
      //   req.session.search = usercontent;

      //   console.log(userResults+"string")
      //   res.render("search2", {
      //     userResults,
      //     loggedIn: req.session.loggedIn,
      //   });
      //   res.status(200).send(usercontent);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

/* Route for searching for all the users. */
router.get('/search/all', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    const rawAllUserData = await User.findAll({
      include: [
        {
            model: User,
            as: "friend_id_req",
            through: {
              where: {
                friend_id_req: req.session.user
              }
            }
        },
    ]
    });

    const userResults = rawAllUserData.map(rawUserData => rawUserData.get({ plain: true }));

    const friendUsernames = res.locals.friends.map(friend => friend.username);

    const nonFriendUsers = userResults.filter((user) => {
        return !friendUsernames.includes(user.username);
    });

    const nonFriendNonUserResults = nonFriendUsers.filter((user) => {
      return user.username != req.session.username;
    });

    res.render('search', {
      friends: res.locals.friends,
      friendRequests: res.locals.friendRequests,
      userResults: nonFriendNonUserResults,
      friendRequestsSent: res.locals.friendRequestsSent,
      loggedIn: req.session.loggedIn,
      searchResults: true,
      search: true,
      user: {
        loggedIn: req.session.loggedIn,
        username: req.session.username,
        steam_username: req.session.steam_username,
        steam_avatar_full: req.session.steam_avatar_full,
        profile_url: req.session.profile_url
      }
    });
});

// router.get("/content", async (req, res) => {
//   if (!req.session.loggedIn) {
//     res.redirect("/login");
//   } else {
//     try {
//       userResults = req.session.search;
//       console.log(userResults)
//       res.render("search2", {
//          userResults,
//          loggedIn: req.session.loggedIn });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json(err);
//     }
//   }
// });
router.get("/content", authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    try {
      console.log(req.session.search + "string");
      const dataVal = await User.findAll({
        where: {
            username:{ [Op.startsWith]: `${req.session.search}` },
        },
        include: [
          {
              model: User,
              as: "friend_id_req",
              through: {
                where: {
                  friend_id_req: req.session.user
                }
              }
          },
        ]
      });
      
      let userResults = dataVal.map(userObj=> userObj.get({plain : true}))

      /* Adam's work starts here. */
      /* I want to filter out all users that are friends of the user and filter out the user from the returned results. */
      /* 
       *  To do that I must: 
       *    1. Get a list of the user's friend usernames.
       *    2. Filter out the returned results based on that list.
       */
      /* 1. Get a list of the user's friend usernames. */
      const friendUsernames = res.locals.friends.map(friend => friend.username);

      /* 2. Filter out the returned results based on that list. */
      const nonFriendUsers = userResults.filter((user) => {
          return !friendUsernames.includes(user.username);
      });

      const nonFriendNonUserResults = nonFriendUsers.filter((user) => {
        return user.username != req.session.username;
      });

      /* End Adam's work. */

      //console.log(userResults,"here");
      
      res.render("search", {
        friends: res.locals.friends,
        friendRequests: res.locals.friendRequests,
        friendRequestsSent: res.locals.friendRequestsSent,
        userResults: nonFriendNonUserResults,
        loggedIn: req.session.loggedIn,
        searchResults: true,
        search: true,
        user: {
          loggedIn: req.session.loggedIn,
          username: req.session.username,
          steam_username: req.session.steam_username,
          steam_avatar_full: req.session.steam_avatar_full,
          profile_url: req.session.profile_url
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});
module.exports = router;

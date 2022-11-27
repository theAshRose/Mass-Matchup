const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require("dotenv").config();
const request = require("request");
var rp = require("request-promise");
const { parse } = require("handlebars");
const { getFriendsAndFriendRequests, authorizeUser } = require('../utils/middleware');

const { Op } = require("sequelize");


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
    userResults: nonFriendNonUserResults,
    loggedIn: req.session.loggedIn,
    searchResults: true,
    search: true,
    queryTerm: `all users`,
    user: {
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      steam_username: req.session.steam_username,
      steam_avatar_full: req.session.steam_avatar_full,
      profile_url: req.session.profile_url
    }
  });
});

router.get("/search", authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
  try {
    //console.log(req.query.name + "string");
    const dataVal = await User.findAll({
      where: {
        username: { [Op.startsWith]: `${req.query.name}` },
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

    let userResults = dataVal.map(userObj => userObj.get({ plain: true }))

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

    //console.log(userResults, "here");

    res.render("search", {
      userResults: nonFriendNonUserResults,
      loggedIn: req.session.loggedIn,
      searchResults: true,
      search: true,
      queryTerm: `'${req.query.name}'`,
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

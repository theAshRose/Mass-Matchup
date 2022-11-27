const router = require("express").Router();
const { User, Friend, FriendReq, Game } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");
const { getFriendsAndFriendRequests, authorizeUser, getAllOwnedGamesForUser, getGameData } = require('../utils/middleware');
const { json } = require("express");
let goodData = true;
let Data;


router.get('/', authorizeUser, getFriendsAndFriendRequests, getAllOwnedGamesForUser, async (req, res) => {
    res.render('user-stats',
        {
            statsPage: true,
            user: {
                loggedIn: req.session.loggedIn,
                username: req.session.username,
                steam_username: req.session.steam_username,
                steam_avatar_full: req.session.steam_avatar_full,
                profile_url: req.session.profile_url
            }
        })
});

router.get('/ownedGameStats/:appid', authorizeUser, getFriendsAndFriendRequests, getAllOwnedGamesForUser, getGameData, async (req, res) => {
    const userData = await User.findByPk(req.session.user)
    // req.session.appid = req.body.appId
    // console.log(req.session.appid)
    const user = await userData.get({ plain: true });
    const steam = user.steam_id

    // console.log(steam, "steam key")
    //console.log(req.session.appid, "why are you bug?")
    var url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + req.params.appid + '&key=' + process.env.APIkey + '&steamid=' + steam
    //console.log(url);
    rp(url).then(async function (data1) {

        let elparso = JSON.parse(data1)
        let stats = [];

        if (elparso.playerstats) {
            if (elparso.playerstats.achievements) {
                let rawAchievements = elparso.playerstats.achievements;
                let achievements = rawAchievements.map((achievement) => {
                    const newAchievement = {};
                    newAchievement.name = achievement.name;
                    newAchievement.score = achievement.achieved;

                    return newAchievement;
                });

                stats = [...achievements];
            }

            if (elparso.playerstats.stats) {
                let rawStats = elparso.playerstats.stats;
                const newStats = rawStats.map((rawStat) => {
                    const newStat = {};
                    newStat.name = rawStat.name;
                    newStat.score = rawStat.value;

                    return newStat;
                });

                stats = [...stats, ...newStats];
            }
        }

        res.render('user-stats',
            {
                stats,
                statsPage: true,
                statResultsPage: true,
                user: {
                    loggedIn: req.session.loggedIn,
                    username: req.session.username,
                    steam_username: req.session.steam_username,
                    steam_avatar_full: req.session.steam_avatar_full,
                    profile_url: req.session.profile_url
                }
            }
        )
    })
        .catch((error) => {
            //console.log(error);
            res.render('user-stats',
                {
                    stats: [],
                    statsPage: true,
                    statResultsPage: true,
                    user: {
                        loggedIn: req.session.loggedIn,
                        username: req.session.username,
                        steam_username: req.session.steam_username,
                        steam_avatar_full: req.session.steam_avatar_full,
                        profile_url: req.session.profile_url
                    }
                }
            )
        });
});


module.exports = router;
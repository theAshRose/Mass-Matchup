const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");
const { getFriendsAndFriendRequests, authorizeUser, desperateMeasures, getFriendData, updateFriendDataIfNecessary, updateFriendOwnedGamesIfNecessary, getAllOwnedGamesForUser, getFriendOwnedGames, getSharedGames, getGameData } = require('../utils/middleware');
const e = require("express");

router.post('/', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            req.session.friend = req.body.friend

            res.send('complete');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
})

router.get('/:id', authorizeUser, getFriendsAndFriendRequests, getFriendData, updateFriendDataIfNecessary, getFriendOwnedGames, getAllOwnedGamesForUser, getSharedGames, async (req, res) => {

    res.render('compare-stats',
        {
            user: {
                loggedIn: req.session.loggedIn,
                username: req.session.username,
                steam_username: req.session.steam_username,
                steam_avatar_full: req.session.steam_avatar_full,
                profile_url: req.session.profile_url
            },
        })
});

router.get('/:id/stats/:appid', authorizeUser, getFriendsAndFriendRequests, getFriendData, updateFriendDataIfNecessary, getFriendOwnedGames, getAllOwnedGamesForUser, getSharedGames, getGameData, async (req, res) => {

    const userUrl = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${req.params.appid}&key=${process.env.APIkey}&steamid=${req.session.steam_id}`;
    const friendUrl = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${req.params.appid}&key=${process.env.APIkey}&steamid=${res.locals.friendData.steam_id}`;

    // console.log(userUrl);
    // console.log(friendUrl);

    const finalStats = [];
    const statsMap = {};

    Promise.all([
        rp(userUrl),
        rp(friendUrl)
    ])
        .then(([rawResponse1, rawResponse2]) => {
            const response1 = JSON.parse(rawResponse1);
            const response2 = JSON.parse(rawResponse2);

            let userStats = [], friendStats = [];
            let rawUserAchievements = [], rawFriendAchievements = []

            /* No stats for the game, just achievements */
            if (response1.playerstats.stats) {
                userStats = response1.playerstats.stats;
            }

            if (response2.playerstats.stats) {
                friendStats = response2.playerstats.stats;
            }

            if (response1.playerstats.achievements) {
                rawUserAchievements = response1.playerstats.achievements;
            }

            if (response2.playerstats.achievements) {
                rawFriendAchievements = response2.playerstats.achievements;
            }

            const userAchievements = rawUserAchievements.map((achievement) => {
                const newObj = {};
                newObj.name = achievement.name;
                newObj.value = achievement.achieved;

                return newObj;
            });
            const finalUserStats = [...userAchievements, ...userStats];

            //console.log(userStats);

            const friendAchievements = rawFriendAchievements.map((achievement) => {
                const newObj = {};
                newObj.name = achievement.name;
                newObj.value = achievement.achieved;

                return newObj;
            });
            const finalFriendStats = [...friendAchievements, ...friendStats];

            for (const stat of finalUserStats) {
                statsMap[stat.name] = {};
                statsMap[stat.name].score = stat.value;
            }

            for (const stat of finalFriendStats) {
                if (statsMap[stat.name]) {
                    statsMap[stat.name].score2 = stat.value;
                } else {
                    statsMap[stat.name] = {};
                    statsMap[stat.name].score = 0;
                    statsMap[stat.name].score2 = stat.value;
                }
            }

            //console.log(Object.entries(statsMap));

            for (const stat of Object.entries(statsMap)) {
                const newStatObj = {};
                newStatObj.name = stat[0];
                newStatObj.score = stat[1].score;
                if (stat[1].score2) {
                    newStatObj.score2 = stat[1].score2;
                } else {
                    newStatObj.score2 = 0;
                }

                finalStats.push(newStatObj);
            }

            res.render('compare-stats',
                {
                    finalStats,
                    compareStatsDisplay: true,
                    user: {
                        loggedIn: req.session.loggedIn,
                        username: req.session.username,
                        steam_username: req.session.steam_username,
                        steam_avatar_full: req.session.steam_avatar_full,
                        profile_url: req.session.profile_url
                    },
                })

        })
        .catch((error) => {
            res.render('compare-stats',
                {
                    finalStats,
                    compareStatsDisplay: true,
                    private: true,
                    user: {
                        loggedIn: req.session.loggedIn,
                        username: req.session.username,
                        steam_username: req.session.steam_username,
                        steam_avatar_full: req.session.steam_avatar_full,
                        profile_url: req.session.profile_url
                    },
                })
        });
});



module.exports = router;
const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");
const controller = new AbortController();
const { getFriendsAndFriendRequests, authorizeUser, getFriendData, desperateMeasures } = require('../utils/middleware');
const { newsCleanUp } = require('../utils/helpers')

let ownedGamesData;

let temp1;
let temp2;
let temp3
let newsArray = [];
let newsPerGame = []
let start;
let games
router.get('/', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user, {
            where: {
                id: req.params.id
            }
        })
        if (req.session.privateProfile == 1) {
            res.redirect('403')
        }
        const dbfriendData1 = await Friend.findAll({
            where: {
                friend_id: req.session.user,
            },
        });
        const dbfriendData2 = await Friend.findAll({
            where: {
                link_id: req.session.user,
            },
        });
        const friends = [];
        const friendContent1 = dbfriendData1.map((friend) =>
            friend.get({ plain: true })
        );
        const friendUserId1 = friendContent1.map((friend) =>
            friends.push(friend.link_id)
        );
        const friendContent2 = dbfriendData2.map((friend) =>
            friend.get({ plain: true })
        );
        const friendUserId2 = friendContent2.map((friend) =>
            friends.push(friend.friend_id)
        );

        const friendNames = [];

        for (i = 0; i < friends.length; i++) {
            const dbfriendUsername = await User.findByPk(friends[i]);
            friendNames.push(dbfriendUsername);
        }


        temp1;
        temp2;
        temp3;
        newsArray = [];
        newsPerGame = []
        const user = userData.get({ plain: true });
        const steam = user.steam_id
        start = 0

        var url = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steam + '&format=json'

        rp(url, async function (err, res, body) {
            if (!err && res.statusCode < 400) {
                temp1 = JSON.parse(body)
                const userRecentlyPlayed = await temp1
                return temp1
            }
        }).then(function (playedData) {
            let parsedData = JSON.parse(playedData)
            games = parsedData.response.games
            //Contingency if results are not found, this is needed to stop server crash.
            if (parsedData.response.total_count === 0) {
                res.redirect('user-stats')
            }

            function getNews() {
                rp('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=' + parsedData.response.games[start].appid + '&count=3&maxlength=300&format=json)', async function (err, res, body) {
                    if (!err && res.statusCode < 400) {
                        temp2 = JSON.parse(body)
                        const recentlyPlayedNews = await temp2

                        newsArray = [];
                        newsTemp = []
                        newsTemp2 = []
                        newsArray.push(recentlyPlayedNews)
                        let parsedArray = JSON.stringify(newsArray)


                        for (i = 0; i < 3; i++) {
                            newsTemp.push(newsArray[0].appnews.newsitems[i])
                        }

                        // for (x=0; x <3; x++){
                        // newsCleanUp(newsTemp[i].contents)
                        // }
                        

                        let gameNews = {
                            name: games[start].name,
                            news: newsTemp
                        }
                        newsPerGame.push(gameNews)


                        return newsPerGame
                    }
                }).then(function (content) {
                    start = start + 1
                    if (start < games.length) {

                        getNews()
                    } else {
                        rp('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + process.env.APIkey + '&steamids=' + steam, async function (err, res, body) {
                            if (!body){
                                res.redirect('404')
                            }
                            temp3 = JSON.parse(body)
                            let userInfo = temp3.response.players[0]
                            const userSummary = await temp3

                            return (userInfo)
                        }).then(function (userContent) {

                            let friends = friendNames.map(userObj => userObj.get({ plain: true }))

                            res.render('dashboard',
                                {
                                    friends: res.locals.friends,
                                    friendRequests: res.locals.friendRequests,
                                    temp3,
                                    newsPerGame,
                                    games,
                                    user: {
                                        loggedIn: req.session.loggedIn,
                                        username: req.session.username,
                                        steam_username: req.session.steam_username,
                                        steam_avatar_full: req.session.steam_avatar_full,
                                        profile_url: req.session.profile_url
                                    }
                                })
                        }
                        )
                    }
                })
            }
            getNews()
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.get('/search', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {

    try {
        res.render('search',
            {

                friends: res.locals.friends,
                friendRequests: res.locals.friendRequests,
                search: true,
                user: {
                    loggedIn: req.session.loggedIn,
                    username: req.session.username,
                    steam_username: req.session.steam_username,
                    steam_avatar_full: req.session.steam_avatar_full,
                    profile_url: req.session.profile_url
                }
            })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

/* Route to go to a friend's see stats page. */
router.get('/friends/:id/stats', authorizeUser, getFriendsAndFriendRequests, getFriendData, async (req, res) => {
    /* We need to get information about the friend. */    
    try{

    const ownedGamesSteamAPIURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.APIkey}&steamid=${res.locals.friendData.steam_id}&format=json&include_appinfo=true`;


    const ownedGamesRawData = await rp(ownedGamesSteamAPIURL);

    const gamesData = JSON.parse(ownedGamesRawData);
    // if (gamesData.response.length == undefined && !gamesData.response.games) {
    //     res.redirect("404")
    // }
    const ownedGamesDataUnsorted = await gamesData.response.games
                    // if (ownedGamesDataUnsorted == undefined) {                        
                    //     return;                      
                    // }
    // Dom's sort function.
    
    const ownedGamesDataSorted = ownedGamesDataUnsorted.sort(function (a, b) {
        return parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever);
    }); 





   
    ownedGamesData = ownedGamesDataSorted;

    res.render('friend-stats', {
        friends: res.locals.friends,
        friendRequests: res.locals.friendRequests,
        friendData: res.locals.friendData,
        ownedGames: ownedGamesDataSorted,
        user: {
            loggedIn: req.session.loggedIn,
            username: req.session.username,
            steam_username: req.session.steam_username,
            steam_avatar_full: req.session.steam_avatar_full,
            profile_url: req.session.profile_url
        }
    });} catch (err) {
      
        res.redirect('/')
        
    }
});

/* Route to see the stats on the friend's stats page after clicking on a button. */
router.get('/friends/:id/stats/:appid', authorizeUser, getFriendsAndFriendRequests, getFriendData, async (req, res) => {

    if (!ownedGamesData) {
        const ownedGamesSteamAPIURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.APIkey}&steamid=${res.locals.friendData.steam_id}&format=json&include_appinfo=true`;

        const ownedGamesRawData = await rp(ownedGamesSteamAPIURL);

        const gamesData = JSON.parse(ownedGamesRawData);
        // if (gamesData.response.length == undefined && !gamesData.response.games) {
        //     res.redirect("404")
        // }
        const ownedGamesDataUnsorted = gamesData.response.games
        // Dom's sort function.
        const ownedGamesDataSorted = ownedGamesDataUnsorted.sort(function (a, b) {
            return parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever);
        });

        ownedGamesData = ownedGamesDataSorted
    }
    const gameStatsAPIURL = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${req.params.appid}&key=${process.env.APIkey}&steamid=${res.locals.friendData.steam_id}`; 
    //console.log(gameStatsAPIURL);
    //http://localhost:3001/friends/2/stats/834910

    rp(gameStatsAPIURL)
        .then((rawGameStatsData) => {
            const gameStatsData = JSON.parse(rawGameStatsData);

            let achievementMap;
            let gameStats;

            if (gameStatsData.playerstats) {
                //console.log("RESPONSE");

                if (gameStatsData.playerstats.achievements) {
                    achievementMap = gameStatsData.playerstats.achievements.map(achievement => {
                        const newAchievement = achievement;
                        newAchievement.value = achievement.achieved;

                        return newAchievement;
                    });
                } else {
                    achievementMap = [];
                }

                /* For when the response nugget doesn't contain an array called 'stats, only 'achievements'' */
                let rawGameStats;
                if (!gameStatsData.playerstats.stats) {
                    rawGameStats = [];
                } else {
                    rawGameStats = gameStatsData.playerstats.stats;
                }

                gameStats = {
                    name: gameStatsData.playerstats.gameName,
                    stats: [...rawGameStats, ...achievementMap]
                };
            } else {
                console.log("NO RESPONSE");
            }

            res.render('friend-stats', {
                friends: res.locals.friends,
                friendRequests: res.locals.friendRequests,
                friendData: res.locals.friendData,
                ownedGames: ownedGamesData,
                hasStats: true,
                gameStats,
                user: {
                    loggedIn: req.session.loggedIn,
                    username: req.session.username,
                    steam_username: req.session.steam_username,
                    steam_avatar_full: req.session.steam_avatar_full,
                    profile_url: req.session.profile_url
                }
            });
        })
        .catch((error) => {
            res.render('friend-stats', {
                friends: res.locals.friends,
                friendRequests: res.locals.friendRequests,
                friendData: res.locals.friendData,
                ownedGames: ownedGamesData,
                hasStats: false,
                gameStats: {
                    name: "",
                    stats: []
                },
                user: {
                    loggedIn: req.session.loggedIn,
                    username: req.session.username,
                    steam_username: req.session.steam_username,
                    steam_avatar_full: req.session.steam_avatar_full,
                    profile_url: req.session.profile_url
                }
            });
        });
});

// router.get('/search/results', async (req, res) => {
//     if (!req.session.loggedIn) {
//         res.redirect("/login");
//     } else {
//         try {
//             res.render('search2',
//             {
//                 loggedIn: req.session.loggedIn
//             })
//         } catch (err) {
//             console.log(err)
//             res.status(500).json(err)
//         }
//     }

// })

module.exports = router;
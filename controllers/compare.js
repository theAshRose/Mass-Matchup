const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");
const { getFriendsAndFriendRequests, authorizeUser } = require('../utils/middleware');
// let userGames
let freshData = [];
let friendGames;
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

router.get('/sharedGames', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            // req.session.friend = 4
            const userData = await User.findByPk(req.session.user, {})
            const friendData = await User.findByPk(req.session.friend, {})
            const user = userData.get({ plain: true });
            const friendProfile = friendData.get({ plain: true });
            const steam = user.steam_id
            const steamFriend = friendProfile.steam_id
            // console.log(steamFriend, "steamfriend")
            var urlUser = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steam + '&format=json&include_appinfo=true'
            var urlFriend = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steamFriend + '&format=json&include_appinfo=true'
            rp(urlUser, async function (err, res, body) {
                if (!err && res.statusCode < 400) { }
                return body
            }).then(async function (Data1) {
                let Data2 = JSON.parse(Data1)
                userGames = (Data2.response.games)
                rp(urlFriend, async function (err, res, body) {
                    if (!err && res.statusCode < 400) { }
                    return body
                }).then(async function (Data) {
                    // console.log(userGames, "HERE")
                    let DataTemp = JSON.parse(Data)
                    friendGames = await (DataTemp.response.games)
                    // console.log(friendGames, "FRIEND ARRAY")
                    let appidArr1 = []
                    let appidArr2 = []
                    let solution = []
                    let mutGames = []
                    for (i = 0; i < userGames.length; i++) {
                        appidArr1.push(userGames[i].appid)
                    }
                    for (i = 0; i < friendGames.length; i++) {
                        appidArr2.push(friendGames[i].appid)
                    }
                    for (i = 0; i < userGames.length; i++) {
                        let temp = appidArr2.indexOf(userGames[i].appid)
                        if (temp != -1) {
                            solution.push(temp)
                        }
                    }
                    for (i = 0; i < solution.length; i++) {
                        mutGames.push(friendGames[solution[i]])
                    }
                    console.log(solution)
                    // console.log(mutGames, "IM A STRING")
                    return mutGames;
                }).then(async function (sharedGames) {

                    res.render('compare-stats',
                        {

                            friends: res.locals.friends,
                            friendRequests: res.locals.friendRequests,
                            sharedGames,
                            user: {
                                loggedIn: req.session.loggedIn,
                                username: req.session.username,
                                steam_username: req.session.steam_username,
                                steam_avatar_full: req.session.steam_avatar_full,
                                profile_url: req.session.profile_url
                            }
                        })
                })
            })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
});
//userGames[i].name==friendGames[x].name


// res.render('user-stats',
//     {

//         friends: res.locals.friends,
//         friendRequests: res.locals.friendRequests,
//         Data,
//         user: {
//             loggedIn: req.session.loggedIn,
//             username: req.session.username,
//             steam_username: req.session.steam_username,
//             steam_avatar_full: req.session.steam_avatar_full,
//             profile_url: req.session.profile_url
//         }
//     })


// const Data = temp20.sort(function (a, b) {
//     return parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever);
// });

router.get('/sharedGames/:appId', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    try {




        const sharedAppId = req.params.appId



        const userData = await User.findByPk(req.session.user, {})
        const friendData = await User.findByPk(req.session.friend, {})
        const user = userData.get({ plain: true });
        const friendProfile = friendData.get({ plain: true });
        const steam = user.steam_id
        const steamFriend = friendProfile.steam_id
        // console.log(steamFriend, "FRIEND1")
        // console.log(sharedAppId, "sharedAppID")
        // console.log(steam, "user steam ID")


        const userUrl = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + sharedAppId + '&key=' + process.env.APIkey + '&steamid=' + steam
        const friendUrl = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + sharedAppId + '&key=' + process.env.APIkey + '&steamid=' + steamFriend
        /////////MESS STARTS HERE

        rp(userUrl, async function (err, res, body) {
            if (res.statusCode > 400) {
                res.redirect('/user-search/')
                alert("Search did not yield fruit. Pluck again")
            }
            if (!err && res.statusCode < 400) {
                // console.log(body, "naraka")


                let elparso = JSON.parse(body)
                // console.log(elparso + "elparso")
                let temp1 = Object.keys(elparso)
                let no = "elparso." + temp1[0]
                let temp2 = eval(no)
                // console.log(temp2, "temp2")
                let temp3 = Object.keys(temp2)
                // console.log(temp3, "temp3")
                let no2 = 'temp2.' + temp3[2]
                let temp4 = eval(no2)
                // console.log(temp4, "temp4")
                let iAmAwesome = []

                if (temp4) {
                    goodData = true
                    for (i = 0; i < temp4.length; i++) {
                        let noYeah = Object.values(temp4[i])
                        let temp69 = {
                            name: noYeah[0],
                            score: Math.trunc(noYeah[1])
                        }
                        iAmAwesome.push(temp69)
                    }
                } else {
                    goodData = false
                }

                // console.log(iAmAwesome, "IM TEMP 4")
                return iAmAwesome
            }
        }).then(async function (data1) {
            let elparso = JSON.parse(data1)
            let temp1 = Object.keys(elparso)
            let no = "elparso." + temp1[0]
            let temp2 = eval(no)
            let temp3 = Object.keys(temp2)
            let no2 = 'temp2.' + temp3[2]
            let temp4 = eval(no2)
            let iAmAwesome = []
            if (temp4) {
                goodData = true
                for (i = 0; i < temp4.length; i++) {
                    let noYeah = Object.values(temp4[i])
                    let temp69 = {
                        name: noYeah[0],
                        score: Math.trunc(noYeah[1])
                    }
                    iAmAwesome.push(temp69)
                    // console.log(iAmAwesome, "target69")

                }
            } else {
                goodData = false
            } return iAmAwesome;
        }).then(async function (awesomeData) {
            // console.log(awesomeData, "target69")
            const userStats = awesomeData;

            // console.log(sharedAppId, "target1")
            // console.log(steamFriend, "target2")
            ///////////////////////////////////////////////MESS 2 starts here
            rp(friendUrl, async function (err, res, body) {
                if (res.statusCode > 400) {
                    res.redirect('/user-search')
                    alert("Search did not yield fruit. Pluck again")
                }
                if (!err && res.statusCode < 400) {
                    // console.log(body, "naraka")


                    let elparso = JSON.parse(body)
                    // console.log(elparso + "elparso")
                    let temp1 = Object.keys(elparso)
                    let no = "elparso." + temp1[0]
                    let temp2 = eval(no)
                    // console.log(temp2, "temp2")
                    let temp3 = Object.keys(temp2)
                    // console.log(temp3, "temp3")
                    let no2 = 'temp2.' + temp3[2]
                    let temp4 = eval(no2)
                    // console.log(temp4, "temp4")
                    let iAmAwesome = []

                    if (temp4) {
                        goodData = true
                        for (i = 0; i < temp4.length; i++) {
                            let noYeah = Object.values(temp4[i])
                            let temp69 = {
                                name: noYeah[0],
                                score: Math.trunc(noYeah[1])
                            }
                            iAmAwesome.push(temp69)
                        }
                    } else {
                        goodData = false
                    }

                    // console.log(iAmAwesome, "IM TEMP 4")
                    return iAmAwesome
                }
            }).then(async function (data1) {
                let elparso = JSON.parse(data1)
                let temp1 = Object.keys(elparso)
                let no = "elparso." + temp1[0]
                let temp2 = eval(no)
                let temp3 = Object.keys(temp2)
                let no2 = 'temp2.' + temp3[2]
                let temp4 = eval(no2)
                let iAmAwesome = []
                if (temp4) {
                    goodData = true
                    for (i = 0; i < temp4.length; i++) {
                        let noYeah = Object.values(temp4[i])
                        let temp69 = {
                            name: noYeah[0],
                            score: Math.trunc(noYeah[1])
                        }
                        iAmAwesome.push(temp69)
                        // console.log(iAmAwesome, "target69")
                        // console.log(iAmAwesome, "target 200")
                        // console.log(userStats, "target69000")

                    } let friendStats = []
                    for (i = 0; i < iAmAwesome.length; i++) {
                        friendStats.push(iAmAwesome[i].score)
                    }
                    // console.log(friendStats)
                    for (i = 0; i < userStats.length; i++) {
                        userStats[i].score2 = friendStats[i]
                    }
                    // console.log(userStats)

                } else {
                    goodData = false
                }
                console.log(goodData)
                
                res.render('compare-stats',
                    {
                        goodData,
                        userStats,
                        friends: res.locals.friends,
                        friendRequests: res.locals.friendRequests,
                        user: {
                            loggedIn: req.session.loggedIn,
                            username: req.session.username,
                            steam_username: req.session.steam_username,
                            steam_avatar_full: req.session.steam_avatar_full,
                            profile_url: req.session.profile_url
                        }
                    })
                // console.log(iAmAwesome, "target 200")
            })//.then goes here?

        })
        // res.status(200).json(proData);
    } catch (err) {
        res.json(500).json(err)
    }
});



module.exports = router;
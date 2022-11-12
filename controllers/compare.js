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
            console.log(steamFriend, "steamfriend")
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
                    console.log(friendGames, "FRIEND ARRAY")
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
                    console.log(mutGames, "IM A STRING")
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
module.exports = router;
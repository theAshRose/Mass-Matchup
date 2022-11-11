const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");
let gamesData;
let gamesObj = [];
router.get('/', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const userData = await User.findByPk(req.session.user, {
                where: {
                    id: req.params.id
                }
            })

            const user = userData.get({ plain: true });
            const steam = user.steam_id
            var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steam + '&format=json&include_appinfo=true'
            rp(url, async function (err, res, body) {
                if (!err && res.statusCode < 400) {
                    // console.log(body.games[0], "STRANG")
                    let parsedGames = JSON.parse(body)
                    let gamesData1 = JSON.stringify(parsedGames.response.games)
                    gamesData = JSON.parse(gamesData1)
                    // {"appid":2600,
                    // "name":"Vampire: The Masquerade - Bloodlines",
                    // "playtime_forever":1813,
                    //"img_icon_url":"9fd08d0034ba09d371e1f1a179a0a3af6c36d1f0",
                    //"playtime_windows_forever":0,
                    //"playtime_mac_forever":0,"playtime_linux_forever":0,
                    //"rtime_last_played":1513845169}
                    // gamesData = JSON.stringify(parsedGames.response.games[0])
                    
                    
                    return gamesData
                }
            }).then(function (Data1) {
                let Data2 = JSON.parse(Data1)
                let Data = (Data2.response.games)
                console.log(Data, "STRANG2")
                res.render('user-stats',
                    {
                        Data,
                        user: {
                            loggedIn: req.session.loggedIn,
                            username: req.session.username,
                            steam_username: req.session.steam_username,
                            steam_avatar_full: req.session.steam_avatar_full,
                            profile_url: req.session.profile_url
                        }
                    })
            })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
})

module.exports = router;

//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json
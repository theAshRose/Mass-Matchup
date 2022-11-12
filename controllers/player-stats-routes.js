const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");
const { getFriendsAndFriendRequests, authorizeUser } = require('../utils/middleware');
let goodData = true;


router.get('/', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const userData = await User.findByPk(req.session.user, {
                // where: {
                //     id: req.params.id
                // }
            })
            const user = userData.get({ plain: true });
            const steam = user.steam_id
            var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steam + '&format=json&include_appinfo=true'
            rp(url, async function (err, res, body) {
                if (!err && res.statusCode < 400) {
                }
            }).then(function (Data1) {
                let Data2 = JSON.parse(Data1)
                let temp20 = (Data2.response.games)
                const Data = temp20.sort(function (a, b) {
                    return parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever);
                });
                res.render('user-stats',
                    {

                        friends: res.locals.friends,
                        friendRequests: res.locals.friendRequests,
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
});
/////////////////////////////////////////////////////////////////////////
router.post('/ownedGameStats', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            req.session.appid = req.body.appId
            console.log(req.session.appid, "when i lost session")
            console.log(req.body.appId, "when i lost body")
            res.send('yes')
            // const userData = await User.findByPk(req.session.user, {
            //     where: {
            //         id: req.params.id
            //     }

            // })

            // const user = userData.get({ plain: true });
            // const steam = user.steam_id
            // var url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + req.body.appId + '&key=' + process.env.APIkey + '&steamid=' + steam + ''
            // rp(url, async function (err, res, body) {
            //     if (!err && res.statusCode < 400) {
            //         console.log(body)
            //         let elparso = JSON.parse(body)
            //         let temp1 = Object.keys(elparso)
            //         let no = "elparso." + temp1[0]
            //         let temp2 = eval(no)
            //         let temp3 = Object.keys(temp2)
            //         let no2 = 'temp2.' + temp3[2]
            //         let temp4 = eval(no2)
            //         let iAmAwesome = []
            //         for (i = 0; i < temp4.length; i++) {
            //             let noYeah = Object.values(temp4[i])
            //             let temp69 = {
            //                 [noYeah[0]]: Math.trunc(noYeah[1])
            //             }
            //             iAmAwesome.push(temp69)

            //         }

            //         console.log(iAmAwesome, "IM TEMP 4")
            //     }
            // })
            // res.render('user-stats',
            //     {
            //         Data,
            //         loggedIn: req.session.loggedIn
            //     })

        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
});

router.get('/ownedGameStats', authorizeUser, getFriendsAndFriendRequests, async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const userData = await User.findByPk(req.session.user, {
                // where: {
                //     id: req.params.id
                // }

            })
            // req.session.appid = req.body.appId
            // console.log(req.session.appid)
            const user = await userData.get({ plain: true });
            const steam = user.steam_id
            // console.log(steam, "steam key")
            console.log(req.session.appid, "why are you bug?")
            var url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + req.session.appid + '&key=' + process.env.APIkey + '&steamid=' + steam
            rp(url, async function (err, res, body) {
                if (res.statusCode > 400) {
                    res.redirect('/user-search/')
                    alert("Search did not yield fruit. Pluck again")
                } 
                if (!err && res.statusCode < 400) {
                    console.log(body, "naraka")

                    let elparso = JSON.parse(body)
                    // console.log(elparso + "elparso")
                    let temp1 = Object.keys(elparso)
                    let no = "elparso." + temp1[0]
                    let temp2 = eval(no)
                    // console.log(temp2, "temp2")
                    let temp3 = Object.keys(temp2)
                    console.log(temp3, "temp3")
                    let no2 = 'temp2.' + temp3[2]
                    let temp4 = eval(no2)
                    console.log(temp4, "temp4")
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
                }
            } else {
                goodData = false
            }

                // console.log(iAmAwesome)
                const userData = await User.findByPk(req.session.user, {

                    // where: {
                    //     id: req.params.id
                    // }
                })
                const user = userData.get({ plain: true });
                const steam = user.steam_id
                // console.log(steam, "is work?")
                // console.log(userData, "i Am the data")

                var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steam + '&format=json&include_appinfo=true'
                rp(url, async function (err, res, body) {
                    if (!err && res.statusCode < 400) {
                    }
                }).then(function (Data1) {
                    let Data2 = JSON.parse(Data1)
                    let temp20 = (Data2.response.games)
                    const Data = temp20.sort(function (a, b) {
                        return parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever);
                    });
                    console.log(iAmAwesome, "i am the best")
                    res.render('user-stats',
                        {   
                            goodData,
                            iAmAwesome,
                            friends: res.locals.friends,
                            friendRequests: res.locals.friendRequests,
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
            });


        } catch (err) {
            console.log(err, "yes of course")
            res.status(500).json(err)
        }
    }
});


module.exports = router;

//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json

//{"playerstats":
//{"steamID":"76561198134108288","gameName":"","stats":
//[{"name":"deaths","value":1301},
//{"name":"bullet_fired","value":21260},
//{"name":"arrow_fired","value":1979},
//{"name":"item_drop","value":13510},
//{"name":"blueprint_studied","value":780},
//{"name":"death_suicide","value":495},
//{"name":"death_fall","value":9},
//{"name":"death_selfinflicted","value":15},
//{"name":"kill_player","value":548},
//{"name":"bullet_hit_player","value":1786},
//{"name":"arrow_hit_entity","value":162},
//{"name":"harvest.stones","value":179936},
//{"name":"bullet_hit_entity","value":8028},
//{"name":"harvest.cloth","value":35504},
//{"name":"harvest.wood","value":375416},
//{"name":"arrow_hit_building","value":45},
//{"name":"kill_bear","value":9},
//{"name":"kill_boar","value":41},
//{"name":"kill_stag","value":24},
//{"name":"kill_chicken","value":5},
//{"name":"kill_horse","value":12},
//{"name":"kill_wolf","value":19},
//{"name":"headshot","value":822},
//{"name":"arrow_hit_boar","value":237},
//{"name":"arrow_hit_bear","value":221},
//{"name":"arrow_hit_wolf","value":100},
//{"name":"arrow_hit_stag","value":49},
//{"name":"arrow_hit_chicken","value":7},
//{"name":"bullet_hit_building","value":3473},
//{"name":"arrow_hit_horse","value":88},
//{"name":"arrow_hit_player","value":226},
//{"name":"death_entity","value":219},
//{"name":"death_wolf","value":18},
//{"name":"death_bear","value":29},
//{"name":"shotgun_fired","value":4411},
//{"name":"shotgun_hit_building","value":698},
//{"name":"shotgun_hit_player","value":359},
//{"name":"bullet_hit_bear","value":1419},
//{"name":"shotgun_hit_entity","value":1303},
//{"name":"bullet_hit_horse","value":76},
//{"name":"bullet_hit_stag","value":106},
//{"name":"bullet_hit_wolf","value":316},
//{"name":"bullet_hit_boar","value":570},
//{"name":"bullet_hit_sign","value":1},
//{"name":"wounded","value":459},
//{"name":"wounded_assisted","value":73},
//{"name":"wounded_healed","value":80},
//{"name":"bullet_hit_playercorpse","value":178},
//{"name":"buchieved":1},
//{"name":"COLLECT_300_METAL_ORE","achieved":1},
//{"name":"VISIT_ROAD","achieved":1},
//{"name":"COLLECT_65_SCRAP","achieved":1},
//{"name":"DESTROY_10_BARRELS","achieved":1},
//{"name":"GLUTTON","achieved":1},
//{"name":"SEALBREAKER","achieved":1},
//{"name":"GIDDY_UP","achieved":1},
//{"name":"KILL_SCIENTIST","achieved":1},
//{"name":"PLAY_INSTRUMENT","achieved":1}]}}


// {"playerstats":
//{"steamID":
//"76561198134108288","gameName":"PLAYERUNKNOWN'S BATTLEGROUNDS",
//"stats":
//[{"name":"ACHIEVE000_ACHIEVE000","value":1},
//{"name":"ACHIEVE003_ACHIEVE003","value":1},
//{"name":"ACHIEVE004_ACHIEVE004","value":41},
//{"name":"ACHIEVE005_ACHIEVE005","value":14},
//{"name":"ACHIEVE006_ACHIEVE006","value":143},
//{"name":"ACHIEVE007_ACHIEVE007","value":143},
//{"name":"ACHIEVE008_ACHIEVE008","value":143},
//{"name":"ACHIEVE009_ACHIEVE009","value":62},
//{"name":"ACHIEVE010_ACHIEVE010","value":62},
//{"name":"ACHIEVE011_ACHIEVE011","value":62},
//{"name":"ACHIEVE012_ACHIEVE012","value":2},
//{"name":"ACHIEVE013_ACHIEVE013","value":2},
//{"name":"ACHIEVE014_ACHIEVE014","value":2},
//{"name":"ACHIEVE015_ACHIEVE015","value":420},
//{"name":"ACHIEVE016_ACHIEVE016","value":420},
//{"name":"ACHIEVE017_ACHIEVE017","value":420},
//{"name":"ACHIEVE018_ACHIEVE018","value":420},
//{"name":"ACHIEVE019_ACHIEVE019","value":6},
//{"name":"ACHIEVE020_ACHIEVE020","value":20},
//{"name":"ACHIEVE021_ACHIEVE021","value":2},
//{"name":"ACHIEVE022_ACHIEVE022","value":2},
//{"name":"ACHIEVE023_ACHIEVE023","value":7},
//{"name":"ACHIEVE024_ACHIEVE024","value":2},
//{"name":"ACHIEVE025_ACHIEVE025","value":10},
//{"name":"ACHIEVE026_ACHIEVE026","value":39},
//{"name":"ACHIEVE028_ACHIEVE028","value":229},
//{"name":"ACHIEVE030_ACHIEVE030","value":35},
//{"name":"ACHIEVE031_ACHIEVE031","value":6},
//{"name":"ACHIEVE032_ACHIEVE032","value":2},
//{"name":"ACHIEVE033_ACHIEVE033","value":4},
//{"name":"ACHIEVE034_ACHIEVE034","value":23},
//{"name":"ACHIEVE036_ACHIEVE036","value":12}],
//"achievements":
//[{"name":"ACHIVE003","achieved":1},
//{"name":"ACHIVE004","achieved":1},
//{"name":"ACHIVE005","achieved":1},
//{"name":"ACHIVE007","achieved":1},
//{"name":"ACHIVE008","achieved":1},
//{"name":"ACHIVE010","achieved":1},
//{"name":"ACHIVE011","achieved":1},
//{"name":"ACHIVE016","achieved":1},
//{"name":"ACHIVE017","achieved":1},
//{"name":"ACHIVE018","achieved":1},
//{"name":"ACHIVE020","achieved":1},
//{"name":"ACHIVE023","achieved":1},
//{"name":"ACHIVE028","achieved":1},
//{"name":"ACHIVE030","achieved":1},
//{"name":"ACHIVE031","achieved":1},
//{"name":"ACHIVE032","achieved":1},
//{"name":"ACHIVE034","achieved":1},
//{"name":"ACHIVE036","achieved":1}]}}

// {"playerstats":
//{"steamID":
//"76561198134108288","gameName":"Warhammer: Vermintide 2","achievements":
//[{"name":"complete_tutorial","achieved":1},
//{"name":"complete_act_one","achieved":1},
//{"name":"complete_act_two","achieved":1},
//{"name":"complete_act_three","achieved":1},
//{"name":"complete_skittergate_recruit","achieved":1},
//{"name":"complete_skittergate_veteran","achieved":1},
//{"name":"complete_skittergate_champion","achieved":1},
//{"name":"complete_skittergate_legend","achieved":1},
//{"name":"level_thirty_wood_elf","achieved":1},
//{"name":"level_thirty_witch_hunter","achieved":1},
//{"name":"level_thirty_bright_wizard","achieved":1},
//{"name":"level_thirty_dwarf_ranger","achieved":1},
//{"name":"unlock_first_talent_point","achieved":1},
//{"name":"unlock_all_talent_points","achieved":1},
//{"name":"craft_item","achieved":1},
//{"name":"craft_fifty_items","achieved":1},
//{"name":"salvage_item","achieved":1},
//{"name":"salvage_hundred_items","achieved":1},
//{"name":"equip_common_quality","achieved":1},
//{"name":"equip_rare_quality","achieved":1},
//{"name":"equip_exotic_quality","achieved":1},
//{"name":"equip_all_exotic_quality","achieved":1},
//{"name":"equip_veteran_quality","achieved":1},
//{"name":"complete_level_all","achieved":1}]}}
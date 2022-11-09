const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
let temp1;
let temp2;
let newsArray = [];

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
            
            
            var url = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steam + '&format=json'
            
           rp(url, async function (err, response, body) {
                if (!err && response.statusCode < 400) {
                     temp1 = JSON.parse(body)
                     res.send(temp1)
                   const userRecentlyPlayed = await temp1
                   return temp1
                }
            }).then(function(playedData) {
                console.log(playedData[0].response+"first.then HERE");
                for (x=0; x<playedData.length; x++){
                // var url = ;
                rp('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid='+playedData.response.games[x].appid+'&count=3&maxlength=300&format=json)', async function (err, response, body) {
                    if (!err && response.statusCode <400){
                        temp2 = JSON.parse(body)
                        res.send(temp1)
                        const recentlyPlayedNews = await temp2
                        newsArray.push(recentlyPlayedNews)
                        return temp2
                    }
                });
            }
            })
        
//.appnews.newsitems[0]
            // console.log(userRecentlyPlayed.response.games[0].appid+"requestwait")





            // res.render('dashboard', {
            //       user,
            //       loggedIn: req.session.loggedIn,
            //     });
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
})



module.exports = router;
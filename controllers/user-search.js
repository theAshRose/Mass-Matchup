const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require('dotenv').config();
const request = require('request');
var rp = require('request-promise');
const { parse } = require("handlebars");


router.post('/results', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const userInfo = await User.findAll({
                where: {
                    username:{ [Op.like]: req.body.search } 
                }
            })
            if(userInfo < 1){
                const userResults = userInfo.get({ plain: true })
            }else{
                const userResults = userInfo.map((friend) => friend.get({ plain: true }))
            }
            res.render('search',
            {userResults,
                loggedIn: req.session.loggedIn
            })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

})

module.exports = router;
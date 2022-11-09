const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");

router.get('/', async (req, res) => {
    try {
        res.render('login',           
            );
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/signup', async (req, res) => {
    try {
        res.render('signup',           
            );
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});
module.exports = router;

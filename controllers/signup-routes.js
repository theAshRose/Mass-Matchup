const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");

router.get('/', async (req, res) => {
    try {
        res.render('signup');
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/instructions', async (req, res) => {
    res.render('signup-instructions');
});

module.exports = router;

const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");

router.post("/request", async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const dbFriendData = await FriendReq.create({
                link_id: req.session.user,
                friend_id: req.body.friend,
            });

            res.send(dbFriendData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

router.post("/accept", async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const dbFriendData = await Friend.create({
                link_id: req.session.user,
                friend_id: req.body.friend,
            });

            res.send(dbFriendData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

router.get("/",async (req, res) => {
          if (!req.session.loggedIn) {
            res.redirect("/login");
         } else {
        try {
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
            
            res.send(friendNames);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
    }
);

module.exports = router;

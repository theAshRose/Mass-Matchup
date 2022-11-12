const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
const { authorizeUser } = require('../utils/middleware');

router.post("/request", async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            console.log(req.body.friend, "it is here ")
            const dbFriendData = await FriendReq.create({
                link_id_req: req.session.user,
                friend_id_req: req.body.friend,
            });

            res.json(dbFriendData);
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

/* Route to DELETE a friend request */
router.delete('/request/:id', authorizeUser, async (req, res) => {
    FriendReq.destroy({
        where: {
            id: req.params.id
        }
    })
    .then((numDestroyedRows) => {
        /* If the number of destroyed rows is 0, there's a problem with the request. */
        if (!numDestroyedRows) {
            res.status(400).json({ message: "No requests deleted!" });
        } else {
            res.status(200).json(numDestroyedRows);
        }
    })
    .catch((error) => {
        console.log(error);
        res.status.json(error);
    });
});

/* 
 *  Route to DELETE a friend relationship. 
 *  @param id:  The ID of the of the friend relationship in the friend table to delete.
 */
router.delete('/:id', authorizeUser, (req, res) => {
    Friend.destroy({
        where: {
            id: req.params.id
        }
    })
    .then((numDestroyedRows) => {
        /* If the number of destroyed rows is 0, there's a problem with the request. */
        if (!numDestroyedRows) {
            res.status(400).json({ message: "No friends deleted!" });
        } else {
            res.status(200).json(numDestroyedRows);
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
});

module.exports = router;

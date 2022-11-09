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

router.get("/", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      const dbfriendData1 = await Friend.findAll({
        where: {
          friend_id: req.session.user,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      const dbfriendData2 = await Friend.findAll({
        where: {
          link_id: req.session.user,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });

      const friendContent1 = dbfriendData1.map((friend) => friend.get({ plain: true }));
      const friendComment2 = dbfriendData2.map((friend) => friend.get({ plain: true }));
      const friends = friendContent1.concat(friendComment2)
      console.log(friends)
      res.send(friends)
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

module.exports = router;

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

      const Posts = dbPostData.map((post) => post.get({ plain: true }));

      res.send(dbFriendData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

module.exports = router;

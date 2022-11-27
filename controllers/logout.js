const router = require("express").Router();

router.post("/", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(200).json({ message: "You are now logged out!" });
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
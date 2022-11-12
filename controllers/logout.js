const router = require("express").Router();

router.get("/", (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).redirect('/');
      });
    } else {
      res.status(404).end();
    }
  });

  module.exports = router;
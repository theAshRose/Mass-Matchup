const router = require("express").Router();

const apiRoutes = require("./api");
const dash = require("./MMprofile-routes.js");
const friendRoutes = require("./friend-routes");
const login = require("./login");
const results = require("./user-search");
const userStats = require("./player-stats-routes")

router.use("/user", results);
router.use("/user-stats", userStats)
router.use("/", dash);
router.use("/api", apiRoutes);
router.use("/friends", friendRoutes);
router.use("/login", login);
//          /login/signup for signup
module.exports = router;
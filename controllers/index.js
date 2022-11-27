const router = require("express").Router();

const apiRoutes = require("./api");
const dash = require("./MMprofile-routes.js");
const friendRoutes = require("./friend-routes");
const signup = require("./signup-routes");
const results = require("./user-search");
const userStats = require("./player-stats-routes")
const logOut = require("./logout")
const compare = require("./compare")

router.use("/user", results);
router.use("/compare", compare);
router.use("/user-stats", userStats)
router.use("/logout", logOut);
router.use("/", dash);
router.use("/api", apiRoutes);
router.use("/friends", friendRoutes);
router.use("/signup", signup);
//          /login/signup for signup
module.exports = router;
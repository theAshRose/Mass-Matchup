const router = require("express").Router();

const apiRoutes = require("./api");
const dash = require("./MMprofile-routes.js");
const friendRoutes = require("./friend-routes");
const login = require("./login");
const results = require("./user-search");
const userStats = require("./player-stats-routes")
const logOut = require("./logout")
const compare = require("./compare")
const fourOhFour = require('./404')
const fourOhThree = require('./403')

router.use("/user", results);
router.use("/compare", compare);
router.use("/user-stats", userStats)
router.use("/404", fourOhFour)
router.use("/403", fourOhThree)
router.use("/logout", logOut);
router.use("/", dash);
router.use("/api", apiRoutes);
router.use("/friends", friendRoutes);
router.use("/login", login);
//          /login/signup for signup
module.exports = router;
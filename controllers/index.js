const router = require("express").Router();

const apiRoutes = require("./api");
// const home = require("./home.js");
const friendRoutes = require("./friend-routes");

// router.use("/", home);
router.use("/api", apiRoutes);
router.use("/friends", friendRoutes);

module.exports = router;
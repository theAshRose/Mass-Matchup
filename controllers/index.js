const router = require("express").Router();

const apiRoutes = require("./api");
// const home = require("./home.js");
const friendRoutes = require("./friend-routes");
const login = require("./login");

// router.use("/", home);
router.use("/api", apiRoutes);
router.use("/friends", friendRoutes);
router.use("/login", login);
module.exports = router;
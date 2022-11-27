const router = require("express").Router();

const userRoutes = require("./users.js");
const gamesRoutes = require("./games.js");

router.use("/users", userRoutes);
router.use("/games", gamesRoutes);

module.exports = router;
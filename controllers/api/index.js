const router = require("express").Router();

const userRoutes = require("./login.js");

router.use("/", userRoutes);

module.exports = router;

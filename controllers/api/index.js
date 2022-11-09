const router = require("express").Router();

const userRoutes = require("./login.js");



router.use("/login", userRoutes);

module.exports = router;

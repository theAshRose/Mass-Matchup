const router = require("express").Router();
const { User } = require("../../models");
require('dotenv').config();
const rp = require('request-promise');
const { checkPassword, getSteamUserData, updateUserData, saveSessionData, redirectIfSteamProfileIsPrivate, getOwnedSteamGamesForUser, updateOwnedSteamGamesForUser, getFriendData, updateFriendDataIfNecessary, getSteamDataForSignup, denySignupIfSteamProfileIsPrivate, getOwnedSteamGamesForSignup, denySignupIfNoOwnedGamesHavePlayime, denyLoginIfNoOwnedGamesHavePlayime, createUser } = require('../../utils/middleware');

router.post("/login", checkPassword, getSteamUserData, updateUserData, saveSessionData, redirectIfSteamProfileIsPrivate, getOwnedSteamGamesForUser, denyLoginIfNoOwnedGamesHavePlayime, updateOwnedSteamGamesForUser, async (req, res) => {
    res
        .status(200)
        .json({ user: res.locals.dbUserData, message: "You are now logged in!" });
});

router.post("/signup", getSteamDataForSignup, denySignupIfSteamProfileIsPrivate, getOwnedSteamGamesForSignup, denySignupIfNoOwnedGamesHavePlayime, createUser, updateOwnedSteamGamesForUser, saveSessionData, async (req, res) => {

    res.status(200).json({ message: "Signup succeeded!" });
});

/* Route to update the user data of the user with the given ID. Returns a special status code if the profile is private. */
router.put('/:id', getFriendData, updateFriendDataIfNecessary, (req, res) => {
    console.log(`UPDATING THE DATA OF ${res.locals.friendData.username}`);

    res.status(200).json(1);
});

module.exports = router;
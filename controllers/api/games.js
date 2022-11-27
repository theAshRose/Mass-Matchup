const router = require("express").Router();

const { updateFriendOwnedGamesIfNecessary, getStatsForGame } = require('../../utils/middleware');

/* 
 *  This route is a request to the server to update a user's owned games if necessary.
 *  I have this as a seperate route so that if we do need to update a user's games and their STEAM game information is
 *  is now private, I can send a special status code to inform the user.
 */
router.post('/', updateFriendOwnedGamesIfNecessary, (req, res) => {
    res.status(200).json({ message: "Friend owned games are up to date!" });
});

module.exports = router;
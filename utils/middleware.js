const router = require("express").Router();
const { User, Friend, FriendReq, Game, UserGame, News } = require("../models");
const { Op } = require("sequelize");

var moment = require('moment'); // require
moment().format();

require('dotenv').config();

const {
    fetchAndReturnSteamOwnedGameData,
    updateOwnedGamesByUserID,
    fetchAndReturnSteamUserData,
    updateUserDataByUserID,
    getAndSortAllOwnedGamesByUserID,
    fetchAndUpdateOwnedGames,
    fetchAndUpdateSteamGameNews
} = require('./utils');

function authorizeUser(req, res, next) {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        next();
    }
}

async function checkPassword(req, res, next) {
    //console.log("CHECKING PASSWORD");
    try {
        const dbUserData = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

        if (!dbUserData) {
            res
                .status(400)
                .json({ message: "No user found with that username!" });
            return;
        } else {
            const validPassword = await dbUserData.checkPassword(req.body.password);

            if (!validPassword) {
                res
                    .status(400)
                    .json({ message: "Your password is incorrect!" });
                return;
            } else {
                req.session.user = dbUserData.id;
                res.locals.dbUserData = dbUserData;
                next();
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

function createUser(req, res, next) {
    User.create({
        username: req.body.username,
        password: req.body.password,
        steam_id: req.body.steam_id,
        steam_avatar_full: res.locals.playerData.avatarfull,
        steam_username: res.locals.playerData.personaname,
        profile_url: res.locals.playerData.profileurl,
        communityvisibilitystate: res.locals.playerData.communityvisibilitystate
    })
        .then((user) => {
            req.session.user = user.id;
            res.locals.dbUserData = user;

            next();
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

/* Just to be safe, I'm going to deny access to anyone that doesn't have playtime on any game as we use that information to choose which games to display that lead to stats. */
function denyLoginIfNoOwnedGamesHavePlayime(req, res, next) {
    // console.log(res.locals.ownedGamesSteamData);

    const ownedGamesWithPlaytime = res.locals.ownedGamesSteamData.filter(game => game.playtime_forever);

    if (ownedGamesWithPlaytime.length) {
        next();
    } else {
        res.status(403).json({ message: "Your steam game total playtime information is private!" });
    }
}

function denySignupIfNoOwnedGamesHavePlayime(req, res, next) {
    // console.log(res.locals.signupOwnedGamesSteamData);
    const ownedGamesWithPlaytime = res.locals.ownedGamesSteamData.filter(game => game.playtime_forever);

    if (ownedGamesWithPlaytime.length) {
        next();
    } else {
        res.status(403).json({ message: `Your steam game total playtime information is private!` });
    }
}

function denySignupIfSteamProfileIsPrivate(req, res, next) {
    if (res.locals.playerData.communityvisibilitystate === 1) {
        res.status(403).json({ message: "Your steam profile is private!" });
    } else {
        next();
    }
}

async function desperateMeasures() {

    router.get('/', function (req, res) {
        res.redirect('/')
    })

}

/*
 *  Get all games that the user owns from the database and puts it in a session variable.
 */
async function getAllOwnedGamesForUser(req, res, next) {
    getAndSortAllOwnedGamesByUserID(req.session.user)
        .then((games) => {
            res.locals.ownedGames = games;

            next();
        })
        .catch((error) => {
            console.log(error);
        })
}

async function getAllRecentGameNews(req, res, next) {
    const newsList = await Promise.all(res.locals.recentGames.map(async (game) => {
        const rawGameNews = await Game.findByPk(game.id, {
            include: [
                {
                    model: News,
                    seperate: true,
                    limit: 3
                }
            ],
        });

        const gameNews = rawGameNews.get({ plain: true });

        return {
            name: game.name,
            news: gameNews.news
        }
    }));

    res.locals.newsPerGame = newsList;

    next();
}

async function getFriendData(req, res, next) {
    //console.log(req.params.id);
    const rawFriendData = await User.findByPk(req.params.id);

    const friendData = rawFriendData.get({ plain: true });

    res.locals.friendData = friendData;

    //console.log(res.locals.friendData);

    next();
}

async function getFriendOwnedGames(req, res, next) {
    getAndSortAllOwnedGamesByUserID(req.params.id)
        .then((ownedGames) => {
            res.locals.friendOwnedGames = ownedGames;

            next();
        })
        .catch((error) => {
            console.log(error);
        })
}

async function getFriendsAndFriendRequests(req, res, next) {
    //console.log("TEST");

    const userData = await User.findByPk(req.session.user, {
        where: {
            id: req.params.id
        },
        include: [
            {
                model: User,
                as: "link_id"
            },
            {
                model: User,
                as: "friend_id"
            },
            {
                model: User,
                as: "link_id_req"
            },
            {
                model: User,
                as: "friend_id_req"
            },
        ]
    })

    const rawFriends = [...userData.link_id, ...userData.friend_id];

    const friends = rawFriends.map(rawFriend => rawFriend.get({ plain: true }));

    res.locals.friends = friends;

    const rawFriendRequests = [...userData.link_id_req];

    const friendRequests = rawFriendRequests.map(rawFriendRequest => rawFriendRequest.get({ plain: true }));

    res.locals.friendRequests = friendRequests;

    const friendRequestsSent = userData.friend_id_req.map(friendReq => friendReq.get({ plain: true }));

    res.locals.friendRequestsSent = friendRequestsSent;

    next();
}

function getGameData(req, res, next) {
    Game.findOne(
        {
            where: {
                app_id: req.params.appid
            }
        }
    )
        .then((rawGameData) => {
            const game = rawGameData.get({ plain: true });

            res.locals.game = game;

            next();
        })
        .catch((error) => {
            console.log(error);
        });
}

function getSharedGames(req, res, next) {
    //console.log(res.locals.friendOwnedGames.length);
    //console.log(res.locals.ownedGames.length);
    const friendsOwnedGameAppIDs = res.locals.friendOwnedGames.map((game) => {
        return game.app_id
    });

    const ownedGameAppIDs = res.locals.ownedGames.map((game) => {
        return game.app_id
    });

    const sharedOwnedGames = res.locals.ownedGames.filter((game) => {
        return friendsOwnedGameAppIDs.includes(game.app_id);
    });

    const sortedSharedOwnedGames = sharedOwnedGames.sort(function (a, b) {
        return parseFloat(a.app_id) - parseFloat(b.app_id);
    });

    const friendSharedGames = res.locals.friendOwnedGames.filter((game) => {
        return ownedGameAppIDs.includes(game.app_id);
    });

    const sortedFriendSharedGames = friendSharedGames.sort(function (a, b) {
        return parseFloat(a.app_id) - parseFloat(b.app_id);
    });

    // console.log(sortedFriendSharedGames);

    const sharedGames = sortedSharedOwnedGames;
    for (let i = 0; i < sharedGames.length; i++) {
        const userPlaytime = sortedSharedOwnedGames[i].user_game.playtime_forever;
        // console.log(`YOU HAVE PLAYED ${sharedGames[i].name} ${userPlaytime} TOTAL MINUTES`);
        const friendPlaytime = sortedFriendSharedGames[i].user_game.playtime_forever;
        // console.log(`YOUR FRIEND HAS PLAYED ${sharedGames[i].name} ${friendPlaytime} TOTAL MINUTES`);
        sharedGames[i].playtime_forever = userPlaytime + friendPlaytime;
        // console.log(`YOU BOTH HAVE PLAYED ${sharedGames[i].name} ${sharedGames[i].playtime_forever} COMBINED TOTAL MINUTES`);
    }

    const sortedSharedGames = sharedGames.sort(function (a, b) {
        return parseFloat(b.playtime_forever) - parseFloat(a.playtime_forever);
    });

    //console.log(sortedSharedGames);

    res.locals.sharedGames = sortedSharedGames;

    next();
}

function getOwnedSteamGamesForSignup(req, res, next) {
    fetchAndReturnSteamOwnedGameData(req.body.steam_id)
        .then((games) => {
            res.locals.ownedGamesSteamData = games;

            next();
        })
        .catch((error) => {
            res.status(403).json({ message: "Your steam game data is private!" });
        })
}

/* Makes a request to the Steam Web API for the user's owned game information and stores it in a local variable for use later. */
/* Filters out games that don't have community stats visible so I don't have to do it later. */
function getOwnedSteamGamesForUser(req, res, next) {
    fetchAndReturnSteamOwnedGameData(res.locals.dbUserData.steam_id)
        .then((games) => {

            res.locals.ownedGamesSteamData = games;

            next();
        })
        .catch((error) => {
            /* If we can't get owned steam games for the user, that means their game information is private. */
            res.status(403).json({ message: "Your steam game data is private!" });
        });
}

/*
 *  Gets the recently played games for the user, and stores it in a local variable to be used later. Sorts by playtime_2weeks
 *  in descending order.
 */
function getRecentGames(req, res, next) {
    User.findByPk(req.session.userId, {
        include: [
            {
                model: Game,
                through: {
                    where: {
                        playtime_2weeks: {
                            [Op.gt]: 0
                        }
                    }
                },
                include: [
                    {
                        model: News
                    }
                ]
            }
        ]
    })
        .then((user) => {
            const ownedRecentGames = user.games.map(game => game.get({ plain: true }));

            const sortedRecentGames = ownedRecentGames.sort(function (a, b) {
                return parseFloat(b.user_game.playtime_2weeks) - parseFloat(a.user_game.playtime_2weeks);
            });

            //console.log(sortedRecentGames);

            res.locals.recentGames = sortedRecentGames;

            next();
        })
        .catch((error) => {
            console.log(error);
        });
}

function getStatsForGame(req, res, next) {
    console.log(`GETTING USER STATS FOR GAME ${req.params.appid}`);

    next();
}

/* Fetches information about the user with the Steam ID of the user and stores it in res.locals.playerData. */
async function getSteamUserData(req, res, next) {
    fetchAndReturnSteamUserData(res.locals.dbUserData.steam_id)
        .then((userData) => {
            res.locals.playerData = userData;

            next();
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

/* Gets the information from steam about the user with the steam_id of the steam_id provided in the request body. */
function getSteamDataForSignup(req, res, next) {
    fetchAndReturnSteamUserData(req.body.steam_id)
        .then((steamData) => {
            if (steamData) {
                res.locals.playerData = steamData;

                next();
            } else {
                res.status(400).json({ message: "Invalid Steam ID!" });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

async function redirectIfSteamProfileIsPrivate(req, res, next) {
    if (req.session.privateProfile == 3) {
        next();
    } else {
        res.status(403).json({ message: "Your steam user profile is private!" });
    }
}

function saveSessionData(req, res, next) {
    req.session.save(() => {
        req.session.loggedIn = true;
        req.session.userId = res.locals.dbUserData.id;
        req.session.privateProfile = res.locals.playerData.communityvisibilitystate;
        req.session.username = res.locals.dbUserData.username;
        req.session.steam_username = res.locals.playerData.personaname;
        req.session.steam_avatar_full = res.locals.playerData.avatarfull;
        req.session.profile_url = res.locals.playerData.profileurl;
        req.session.steam_id = res.locals.dbUserData.steam_id;

        next();
    });
}

/* Updates the data of the friend whose stats you are viewing if the information is older than a certain amount of time. */
async function updateFriendDataIfNecessary(req, res, next) {
    const updatedAtMoment = moment(res.locals.friendData.updated_at);
    const currentTime = moment();
    const differenceInMinutes = currentTime.diff(updatedAtMoment, 'minutes');
    // console.log(`UPDATING ${res.locals.friendData.username}'s STEAM USER DATA IF NECESSARY`);
    // console.log(`${differenceInMinutes} minutes since last update`);

    if (differenceInMinutes > 10) {
        const friendSteamData = await fetchAndReturnSteamUserData(res.locals.friendData.steam_id);
        await updateUserDataByUserID(res.locals.friendData.id, friendSteamData);

        next();
    } else {
        next();
    }
}

async function updateFriendOwnedGamesIfNecessary(req, res, next) {
    const rawFriendData = await User.findByPk(req.body.id);

    const friendData = rawFriendData.get({ plain: true });

    let differenceInMinutes;

    if (friendData.owned_games_updated_at) {
        const updatedAtMoment = moment(friendData.owned_games_updated_at);
        const currentTime = moment();
        const differenceInMinutes = currentTime.diff(updatedAtMoment, 'minutes');
        // console.log(`${differenceInMinutes} minutes since last owned games update for ${friendData.username}`);
    } else {
        // console.log(`Owned games for ${friendData.username} has never been updated!`);
    }

    if (!differenceInMinutes || differenceInMinutes > 120) {
        // console.log(`UPDATING ${friendData.username}'s OWNED GAMES`);
        fetchAndUpdateOwnedGames(friendData)
            .then((rowsUpdated) => {
                next();
            })
            .catch((error) => {
                res.status(403).json(error);
            })
    } else {
        next();
    }
}

async function updateRecentGamesNews(req, res, next) {
    //console.log(res.locals.recentGames);

    const gameNewsToUpdate = res.locals.recentGames.filter((game) => {
        if (!game.news_updated_at) {
            // console.log(`Game news for ${game.name} has never been updated!`);
            return true;
        } else {
            const updatedAtMoment = moment(game.news_updated_at);
            const currentTime = moment();
            const differenceInMinutes = currentTime.diff(updatedAtMoment, 'minutes');
            // console.log(`${differenceInMinutes} MINUTES SINCE NEWS FOR ${game.name} WAS LAST UPDATED`);

            if (differenceInMinutes > 120) {
                return true;
            } else {
                return false;
            }
        }
    });

    for (const game of gameNewsToUpdate) {
        await fetchAndUpdateSteamGameNews(game);
    }

    next();
}

async function updateOwnedSteamGamesForUser(req, res, next) {
    updateOwnedGamesByUserID(res.locals.dbUserData.id, res.locals.ownedGamesSteamData)
        .then((numRowsUpdated) => {
            next();
        })
        .catch((error) => {
            console.log(error);
        });
}

async function updateUserData(req, res, next) {
    updateUserDataByUserID(res.locals.dbUserData.id, res.locals.playerData)
        .then((numRowsUpdated) => {
            next();
        })
        .catch((error) => {
            console.log(error);
            next();
        });
}

module.exports = {
    getFriendsAndFriendRequests,
    authorizeUser,
    getFriendData,
    desperateMeasures,
    redirectIfSteamProfileIsPrivate,
    checkPassword,
    getSteamUserData,
    updateUserData,
    saveSessionData,
    getOwnedSteamGamesForUser,
    updateOwnedSteamGamesForUser,
    getAllOwnedGamesForUser,
    fetchAndReturnSteamOwnedGameData,
    updateOwnedGamesByUserID,
    fetchAndReturnSteamUserData,
    updateUserDataByUserID,
    getFriendOwnedGames,
    updateFriendDataIfNecessary,
    updateFriendOwnedGamesIfNecessary,
    getSharedGames,
    getStatsForGame,
    getRecentGames,
    updateRecentGamesNews,
    getAllRecentGameNews,
    getSteamDataForSignup,
    denySignupIfSteamProfileIsPrivate,
    getOwnedSteamGamesForSignup,
    denySignupIfNoOwnedGamesHavePlayime,
    denyLoginIfNoOwnedGamesHavePlayime,
    createUser,
    getGameData
};
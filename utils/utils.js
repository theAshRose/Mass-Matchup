var moment = require('moment'); // require
moment().format();
const rp = require('request-promise');

const { User, Game, UserGame, News } = require("../models");
const { Op } = require("sequelize");


function fetchAndReturnSteamGameNews(appID) {
    return new Promise((resolve, reject) => {
        const fetchURL = `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appID}&count=10&maxlength=300&format=json`;
        //console.log(fetchURL);
        rp(fetchURL)
            .then((response) => {
                const rawGameNews = JSON.parse(response).appnews.newsitems;

                resolve(rawGameNews);
            })
            .catch((error) => {
                //console.log(error);
                reject(error);
            });
    });
}

/* Fetches and returns owned game data from the Steam Web API. Also parses the data and filters the games based on whether or not they have stats. */
/* Also filters out any steam data with playtime forever equal to zero as that is an indication that the user's playtime information is private and not indicative of their playtime, so we don't want to update that in the database. */
function fetchAndReturnSteamOwnedGameData(steamID) {
    return new Promise((resolve, reject) => {
        const fetchURL = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.APIkey + '&steamid=' + steamID + '&format=json&include_appinfo=true';
        //console.log(fetchURL);
        rp(fetchURL)
            .then((response) => {
                const ownedGamesSteamData = JSON.parse(response).response.games;

                const filteredGameData = ownedGamesSteamData.filter(steamGame => steamGame.has_community_visible_stats);

                resolve(filteredGameData);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/* Fetches and returns information from Steam about the user with the given steam ID. */
function fetchAndReturnSteamUserData(steamID) {
    return new Promise((resolve, reject) => {
        const fetchURL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.APIkey}&steamids=${steamID}`;
        //console.log(fetchURL);
        rp(fetchURL)
            .then(async (body) => {
                const playerData = JSON.parse(body).response.players[0];

                resolve(playerData);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

function fetchAndUpdateSteamGameNews(game) {
    return new Promise(async (resolve, reject) => {
        const gameNews = await fetchAndReturnSteamGameNews(game.app_id);
        const rowsUpdated = await updateSteamGameNews(gameNews, game);

        resolve(gameNews);
    });
}

function getAndSortAllOwnedGamesByUserID(userID) {
    return new Promise((resolve, reject) => {
        User.findByPk(userID, {
            include: [
                {
                    model: Game,
                    through: {
                        where: {
                            playtime_forever: {
                                [Op.gt]: 0
                            }
                        }
                    }
                }
            ]
        })
            .then((user) => {
                const ownedGames = user.games.map(game => game.get({ plain: true }));

                const sortedGames = ownedGames.sort(function (a, b) {
                    return parseFloat(b.user_game.playtime_forever) - parseFloat(a.user_game.playtime_forever);
                });

                resolve(sortedGames);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function fetchAndUpdateOwnedGames(user) {
    return new Promise(async (resolve, reject) => {
        //console.log(`UPDATING OWNED GAMES FOR ${user.username}`);
        try {
            const steamGameData = await fetchAndReturnSteamOwnedGameData(user.steam_id)
            const rowsUpdated = await updateOwnedGamesByUserID(user.id, steamGameData)
            resolve(rowsUpdated);
        } catch (error) {
            reject(error);
        }
    });
}

// async function updateAllUserData(users) {
//     for (const user of users) {
//         //console.log(`UPDATING USER DATA FOR ${user.username}`);
//         try {
//             const steamUserData = await fetchAndReturnSteamUserData(user.steam_id);
//             updateUserDataByUserID(user.id, steamUserData);
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

// async function updateAllOwnedGamesAndAllUsers() {
//     checkToUpdateUserInformation()
//         .then((users) => {
//             updateAllOwnedGames(users);
//             updateAllUserData(users);
//         })
//         .catch((error) => {
//             console.log(error);
//         })
// }

/* 
 *  Updates the owned steam games information in the database for the user with the input ID using the raw response from the Steam Web API.
 *  In order to update the database with a user's steam games we must:
 *      1. Get all of the user's owned games from the database.
 *      2. Get a list of all steam games that need to be added to the database.
 *      3. Add all steam games that need to be added to the database.
 *      4. Get a list of UserGame relationships that need to be removed.
 *      5. Remove the UserGame relationships.
 *      6. Get a list of UserGame relationships that need to be added to the database.
 *      7. Add the UserGame relationships to the database.
 *      8. Get a list of UserGame relationships to update.
 *      9. Update all UserGame relationships in the database.
 */
function updateOwnedGamesByUserID(userID, userOwnedGamesSteamData) {
    return new Promise(async (resolve, reject) => {
        /* 1. Get all of the user's owned games from the database. */
        User.findByPk(userID, {
            include: [
                {
                    model: Game,
                }
            ]
        })
            .then(async (rawUser) => {
                const ownedDBGames = rawUser.games.map(rawOwnedGame => rawOwnedGame.get({ plain: true }));

                /* 2. Get a list of all steam games that need to be added to the database. */
                const rawGames = await Game.findAll();
                const games = rawGames.map(rawGame => rawGame.get({ plain: true }));
                const gameAppIDS = games.map(game => game.app_id);

                const steamGamesToAdd = userOwnedGamesSteamData.filter(steamGame => !gameAppIDS.includes(steamGame.appid));

                /* 3. Add all steam games that need to be added to the database. */
                const steamGameObjectsToAdd = steamGamesToAdd.map(steamGame => {
                    let steamGameObj = {};
                    steamGameObj.app_id = steamGame.appid;
                    steamGameObj.name = steamGame.name;
                    steamGameObj.img_icon_url = steamGame.img_icon_url;

                    return steamGameObj;
                })
                await Game.bulkCreate(steamGameObjectsToAdd);

                /* 4. Get a list of UserGame relationships that need to be removed. */
                const ownedDBGameAppIDs = ownedDBGames.map(ownedDBGame => ownedDBGame.app_id);
                const steamOwnedGameAppIDs = userOwnedGamesSteamData.map(ownedSteamGame => ownedSteamGame.appid);
                const ownedDBGamesToRemove = ownedDBGames.filter((ownedDBGame) => !steamOwnedGameAppIDs.includes(ownedDBGame.app_id));

                /* 5. Remove the UserGame relationships. */
                const ownedDBGameIDsToRemove = ownedDBGamesToRemove.map(game => game.user_game.id);
                UserGame.destroy({
                    where: {
                        id: ownedDBGameIDsToRemove
                    }
                });

                /* 6. Get a list of UserGame relationships that need to be added to the database. */
                const ownedDBGamesToAdd = userOwnedGamesSteamData.filter((ownedSteamGame) => !ownedDBGameAppIDs.includes(ownedSteamGame.appid));

                //console.log(ownedDBGamesToAdd);

                /* 7. Add the UserGame relationships to the database. */
                const userGameObjsToAdd = await Promise.all(ownedDBGamesToAdd.map(async (game) => {
                    let newUserGameObj = {};
                    const gameData = await Game.findOne({
                        where: {
                            app_id: game.appid
                        }
                    });

                    newUserGameObj.user_id = userID;
                    newUserGameObj.game_id = gameData.id;
                    /* If the steam user has no playtime in the last 2 weeks, there won't be a playtime_2weeks key in the STEAM response. */
                    if (game.playtime_2weeks) {
                        newUserGameObj.playtime_2weeks = game.playtime_2weeks;
                        // console.log(`YOU HAVE PLAYED ${game.name} FOR ${game.playtime_2weeks} MINUTES IN THE PAST 2 WEEKS`);
                    } else {
                        newUserGameObj.playtime_2weeks = 0;
                    }
                    newUserGameObj.playtime_forever = game.playtime_forever;
                    newUserGameObj.playtime_windows_forever = game.playtime_windows_forever;
                    newUserGameObj.playtime_mac_forever = game.playtime_mac_forever;
                    newUserGameObj.playtime_linux_forever = game.playtime_linux_forever;
                    newUserGameObj.rtime_last_played = game.rtime_last_played;

                    return newUserGameObj;
                }));
                await UserGame.bulkCreate(userGameObjsToAdd);

                /* 8. Get a list of UserGame relationships to update. */
                /* I'm filtering out games that have no playtime as any steam user can hide their playtime information, and in that event I don't want to overwrite their accurate playtime information with a bunch of games that have 0 playtime. */
                const ownedSteamGamesToUpdate = userOwnedGamesSteamData.filter((steamGame) => (ownedDBGameAppIDs.includes(steamGame.appid) && steamGame.playtime_forever));

                /* 
                 *  Steam game information doesn't come with the playtime_2weeks key if the user hasn't played in the last two weeks,
                 *  so I need to set that to 0 if that's the case before adding it to the database. 
                 */
                const ownedDBGamesToUpdate = ownedSteamGamesToUpdate.map((game) => {
                    if (!game.playtime_2weeks) {
                        game.playtime_2weeks = 0;
                    } else {
                        // console.log(`YOU HAVE PLAYED ${game.name} FOR ${game.playtime_2weeks} MINUTES IN THE PAST 2 WEEKS`);
                    }

                    return game;
                });

                /* 9. Update all UserGame relationships in the database. */
                let numRowsUpdated = 0;
                for (const game of ownedDBGamesToUpdate) {
                    const dbGameData = await Game.findOne({
                        where: {
                            app_id: game.appid
                        }
                    });

                    const [rows, poop] = await UserGame.update(
                        {
                            playtime_2weeks: game.playtime_2weeks,
                            playtime_forever: game.playtime_forever,
                            playtime_windows_forever: game.playtime_windows_forever,
                            playtime_mac_forever: game.playtime_mac_forever,
                            playtime_linux_forever: game.playtime_linux_forever,
                            rtime_last_played: game.rtime_last_played
                        },
                        {
                            where: {
                                game_id: dbGameData.id,
                                user_id: userID
                            }
                        }
                    );

                    numRowsUpdated += rows;
                }

                await updateOwnedGamesUpdatedAt(userID)

                resolve(numRowsUpdated);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}

function updateSteamGameNews(newsItems, game) {
    return new Promise(async (resolve, reject) => {
        const newsIDs = game.news.map(newsItem => newsItem.gid);

        const rawNewsItemsToAdd = newsItems.filter(newsItem => !newsIDs.includes(newsItem.gid));
        //console.log(rawNewsItemsToAdd);

        const newsItemsToAdd = rawNewsItemsToAdd.map(rawNewsItem => {
            const newsItem = {};
            newsItem.game_id = game.id;
            newsItem.gid = rawNewsItem.gid;
            newsItem.title = rawNewsItem.title;
            newsItem.url = rawNewsItem.url;
            newsItem.author = rawNewsItem.author;
            newsItem.contents = rawNewsItem.contents;
            newsItem.date = rawNewsItem.date;

            return newsItem;
        });

        const newsItemsCreated = await News.bulkCreate(newsItemsToAdd)
        const rowsUpdated = await Game.update(
            {
                news_updated_at: new Date()
            },
            {
                where: {
                    id: game.id
                }
            }
        );

        resolve(newsItemsCreated);
    });
}

/* Updates the user information in the database given a User ID and the raw steam information. */
async function updateUserDataByUserID(userID, userData) {
    return User.update(
        {
            steam_avatar_full: userData.avatarfull,
            steam_username: userData.personaname,
            profile_url: userData.profileurl,
            communityvisibilitystate: userData.communityvisibilitystate
        },
        {
            where: {
                id: userID
            }
        }
    );
}

async function updateOwnedGamesUpdatedAt(userID) {
    return new Promise((resolve, reject) => {
        User.update({
            owned_games_updated_at: new Date()
        },
            {
                where: {
                    id: userID
                }
            })
            .then((numRowsUpdated) => {
                resolve(numRowsUpdated);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}


module.exports = {
    fetchAndReturnSteamOwnedGameData,
    updateOwnedGamesByUserID,
    fetchAndReturnSteamUserData,
    updateUserDataByUserID,
    getAndSortAllOwnedGamesByUserID,
    fetchAndUpdateOwnedGames,
    updateOwnedGamesUpdatedAt,
    fetchAndUpdateSteamGameNews
};
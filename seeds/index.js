const sequelize = require("../config/connection");
const seedUsers = require("./userData");
const seedFriends = require("./friendData");
const seedFriendsReq = require("./friendReqData");
const seedGames = require("./gameData");
const seedUserGames = require("./userGameData");
const seedGameNews = require("./gameNewsData");

const seedAll = async () => {
    await sequelize.sync({ force: true });
    await seedUsers();
    await seedFriends();
    await seedFriendsReq();
    await seedGames();
    await seedUserGames();
    await seedGameNews();

    process.exit(0);
  };

seedAll();
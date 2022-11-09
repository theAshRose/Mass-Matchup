const sequelize = require("../config/connection");
const seedUsers = require("./userData");
const seedFriends = require("./friendData");
const seedFriendsReq = require("./friendReqData");
const seedAll = async () => {
    await sequelize.sync({ force: true });
    await seedUsers();
    await seedFriends();
    await seedFriendsReq();
    process.exit(0);
  };

seedAll();
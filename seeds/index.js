const sequelize = require("../config/connection");
const seedUsers = require("./userData");
const seedFriends = require("./friendData");

const seedAll = async () => {
    await sequelize.sync({ force: true });
    await seedUsers();
    await seedFriends();
    process.exit(0);
  };

seedAll();
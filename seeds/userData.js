const { User } = require("../models");

const UserData = [{
    username: "Carlos Erepo",
    password: "45walabee",
    steam_id: '76561198134108288'
  },
  {
    username: "david44",
    password: "notpassword",
    steam_id: '76561198134108288'
  },
  {
    username: "davinchi",
    password: "trolip1010",
    steam_id: '76561198134108288'
  },
  {
    username: "teslaMan",
    password: "notedison",
    steam_id: '76561199214467239'
  },
  {
    username: "Angel",
    password: "vengence84",
    steam_id: '76561198259999820'
  },]



const seedUsers = () => User.bulkCreate(UserData);

module.exports = seedUsers;
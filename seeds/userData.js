const { User } = require("../models");

const UserData = [{
  username: "Carlos Erepo",
  password: "45walabee",
  steam_id: '76561198134108288',
  steam_avatar_full: 'https://avatars.akamai.steamstatic.com/5a9b5198d6858953b772c86a9e52a6234d1b64e8_full.jpg',
  steam_username: 'Goose, papa?',
  profile_url: "https://steamcommunity.com/profiles/76561198134108288/",
},
{
  username: "david44",
  password: "notpassword",
  steam_id: '76561198134108288',
  steam_avatar_full: 'https://avatars.akamai.steamstatic.com/5a9b5198d6858953b772c86a9e52a6234d1b64e8_full.jpg',
  steam_username: 'Goose, papa?',
  profile_url: "https://steamcommunity.com/profiles/76561198134108288/",
},
{
  username: "davinchi",
  password: "davinchi",
  steam_id: '76561197961411971',
  steam_avatar_full: 'https://avatars.akamai.steamstatic.com/9684c19be46eb8889669c0c791ddcb5c509838f6_full.jpg',
  steam_username: 'Rev. Richard Wayne Gary Wayne',
  profile_url: "https://steamcommunity.com/profiles/76561197961411971/",
},
{
  username: "teslaMan",
  password: "notedison",
  steam_id: '76561199214467239',
  steam_avatar_full: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  steam_username: 'davismasont',
  profile_url: "https://steamcommunity.com/profiles/76561199214467239/",
},
{
  username: "Angel",
  password: "vengence84",
  steam_id: '76561198259999820',
  steam_avatar_full: 'https://avatars.akamai.steamstatic.com/d3f4eba80c8b586c41ff6aaee88f84c6cdc9a710_full.jpg',
  steam_username: 'fy fan',
  profile_url: "https://steamcommunity.com/profiles/76561198259999820/",
},
{
  username: "Olo",
  password: "killCSTG",
  steam_id: '76561198006651484',
  steam_avatar_full: 'https://avatars.akamai.steamstatic.com/d84d56b37bb698158830696b3bef366e16777271_full.jpg',
  steam_username: 'OLO',
  profile_url: "https://steamcommunity.com/profiles/76561198006651484/",
},]

const seedUsers = () => User.bulkCreate(UserData);

module.exports = seedUsers;



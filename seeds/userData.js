const { User } = require("../models");

const UserData = [{
  username: "Carlos Erepo",
  password: "45walabee",
  steam_id: '76561198028318138',
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
},
{
  username: "EdgarAllenBro",
  password: "password",
  steam_id: "76561197960434622",
  steam_avatar_full: "https://technical.ly/wp-content/uploads/2013/11/EdgarAllanBro.jpg",
  steam_username: 'Edgar Allen Bro',
  profile_url: "https://steamcommunity.com/profiles/76561197961411971/"
},
{
  username: "mark",
  password: "password",
  steam_id: "76561197972449074",
  steam_avatar_full: "https://avatars.akamai.steamstatic.com/14c9c3484d8df9255e977e3f95f0cb620bb2d26b_full.jpg",
  steam_username: 'Chairman Miao',
  profile_url: "https://steamcommunity.com/profiles/76561197972449074/"
},
{
  username: "roda",
  password: "extrathicc",
  steam_id: "76561198216156851",
  steam_avatar_full: "https://avatars.akamai.steamstatic.com/7b58968bc4bac5edf9ce016150879e0c1539d8e2_full.jpg",
  steam_username: 'Payday',
  profile_url: "https://steamcommunity.com/profiles/76561198216156851/"
},
{
  username: "andrew",
  password: "farleybaconchicken",
  steam_id: "76561198153468156",
  steam_avatar_full: "https://avatars.akamai.steamstatic.com/ecfdbb7c31116c2cad7dfa1a8bf0f8a2abff018a_full.jpg",
  steam_username: 'Hex: Le GOOSE',
  profile_url: "https://steamcommunity.com/profiles/76561198153468156/"
},
{
  username: "teda",
  password: "tooshort",
  steam_id: "76561198195868989",
  steam_avatar_full: "https://avatars.akamai.steamstatic.com/c4a818da21ea23595d82759dc2f905204b1ea35d_full.jpg",
  steam_username: 'TedaToo$hort',
  profile_url: "https://steamcommunity.com/id/TedaTooShort/"
},
{
  username: "pharce",
  password: "pharcyde",
  steam_id: "76561197976402774",
  steam_avatar_full: "https://avatars.akamai.steamstatic.com/a51d41ae22e8d24839f62981cc22fa158581b642_full.jpg",
  steam_username: 'Pharce',
  profile_url: "https://steamcommunity.com/profiles/76561197976402774/"
},
]

const seedUsers = () => User.bulkCreate(UserData);

module.exports = seedUsers;
const User = require("./User");
const Friend = require("./Friend");
const FriendReq = require("./FriendReq");
const Game = require('./Game');
const UserGame = require('./UserGame');
const News = require('./News');

User.belongsToMany(User, {
    through: Friend,
    foreignKey: "friend_id",
    as: "link_id"
});

User.belongsToMany(User, {
    through: Friend,
    foreignKey: "link_id",
    as: "friend_id"
});

User.belongsToMany(User, {
    through: FriendReq,
    foreignKey: "friend_id_req",
    as: "link_id_req"
});

User.belongsToMany(User, {
    through: FriendReq,
    foreignKey: "link_id_req",
    as: "friend_id_req"
});

Game.belongsToMany(User, {
    through: UserGame,
    foreignKey: "game_id"
});

User.belongsToMany(Game, {
    through: UserGame,
    foreignKey: "user_id"
});

News.belongsTo(Game, {
    foreignKey: "game_id"
});

Game.hasMany(News, {
    foreignKey: "game_id"
});

module.exports = { Friend, User, FriendReq, Game, UserGame, News };
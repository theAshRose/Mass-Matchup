const User = require("./User");
const Friend = require("./Friend");
const FriendReq = require("./FriendReq");

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
module.exports = { Friend, User, FriendReq };
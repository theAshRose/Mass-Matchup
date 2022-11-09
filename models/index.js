const User = require("./User");
const Friend = require("./Friend");


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

module.exports = { Friend, User };
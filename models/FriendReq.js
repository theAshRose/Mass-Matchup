const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class FriendReq extends Model {} 

FriendReq.init(
    { id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      friend_id_req: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      link_id_req: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "friendReq",
})

module.exports = FriendReq;
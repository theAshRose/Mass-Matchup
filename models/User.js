const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  checkPassword(givenpass) {
    return bcrypt.compareSync(givenpass, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
    steam_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    steam_avatar_full: {
      type: DataTypes.STRING,
      allowNull: false
    },
    steam_username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owned_games_updated_at: {
      type: DataTypes.DATE
    },
    communityvisibilitystate: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        //newUserData.owned_games_updated_at = new Date();
        newUserData.password = await bcrypt.hash(newUserData.password, 10);

        return newUserData;
      },
      async beforeBulkCreate(Users) {
        for (const user of Users) {
          const { password } = user;
          user.password = await bcrypt.hash(password, 10);

          //user.owned_games_updated_at = new Date();
        }
      },
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = User;
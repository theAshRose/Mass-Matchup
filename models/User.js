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
    }
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hashSync(newUserData.password, 10);
        return newUserData;
      },
      async beforeBulkCreate(Users) {
        for (const user of Users) {
          const { password } = user;
          user.password = await bcrypt.hashSync(password, 10);
        }
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
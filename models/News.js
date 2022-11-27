const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Game = require("./Game");

class News extends Model {} 

News.init(
    { 
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        }
      },
      gid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "news",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

module.exports = News;
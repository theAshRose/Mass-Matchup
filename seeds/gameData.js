const { Game } = require('../models');

const gameData = [
    {
        app_id: 1361210,
        name: "Warhammer 40,000: Darktide",
        img_icon_url: "d5393efe3861d02745efd35bc406f7740c8d6838"
    },
    {
        app_id: 730,
        name: "Counter-Strike: Global Offensive",
        img_icon_url: "69f7ebe2735c366c65c0b33dae00e12dc40edbe4"
    },
    {
        app_id: 105600,
        name: "Terraria",
        img_icon_url: "858961e95fbf869f136e1770d586e0caefd4cfac"
    },
    {
        app_id: 3830,
        name: "Psychonauts",
        img_icon_url: "460b6471db7d83ee6943c1a87f7a9f2898634952"
    },
    {
        app_id: 552500,
        name: "Warhammer: Vermintide 2",
        img_icon_url: "a671f2ddf7359beba9702ac097baf6d50cb07202"
    },
    {
        app_id: 1063730,
        name: "New World",
        img_icon_url: "082cb546221edf8c9e68d0abda0421ce3c55ee71"
    },
    {
        app_id: 578080,
        name: "PUBG: BATTLEGROUNDS",
        img_icon_url: "609f27278aa70697c13bf99f32c5a0248c381f9d"
    }
]

const seedGames = () => Game.bulkCreate(gameData);

module.exports = seedGames;
const { UserGame } = require('../models');

const userGameData = [
    /*
    {
        user_id: 3,
        game_id: 1,
        playtime_2weeks: 0,
        playtime_forever: 0,
        playtime_windows_forever: 0,
        playtime_mac_forever: 0,
        playtime_linux_forever: 0,
        rtime_last_played: 0
    },
    {
        user_id: 3,
        game_id: 5,
        playtime_2weeks: 0,
        playtime_forever: 47907,
        playtime_windows_forever: 47907,
        playtime_mac_forever: 0,
        playtime_linux_forever: 0,
        rtime_last_played: 1638672799
    },
    {
        user_id: 3,
        game_id: 2,
        playtime_2weeks: 0,
        playtime_forever: 695,
        playtime_windows_forever: 47907,
        playtime_mac_forever: 0,
        playtime_linux_forever: 0,
        rtime_last_played: 1523858233
    },
    {
        user_id: 3,
        game_id: 6,
        playtime_2weeks: 0,
        playtime_forever: 48324,
        playtime_windows_forever: 49,
        playtime_mac_forever: 0,
        playtime_linux_forever: 0,
        rtime_last_played: 1568108475
    }
    */
];

const seedUserGames = () => UserGame.bulkCreate(userGameData);

module.exports = seedUserGames;
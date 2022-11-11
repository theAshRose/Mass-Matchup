// {"appnews":
// 76561198134108288 -doms steam acct

///////////////APP NEWS BY APP ID
/////////////http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json
////////console.log(userBlogs.appnews.newsitems[0], userBlogs.appnews.newsitems[1], userBlogs.appnews.newsitems[2]); 

// //////USER SUMMARY BY PROFILE ID
////////http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+process.env.APIkey+'&steamids=76561198134108288
///// console.log(userBlogs.response.players[0])

///////////////GET PLAYERSTATS FOR GAME BY APP ID AND PLAYER ID
///////// http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=381210&key='+process.env.APIkey+'&steamid=76561198134108288
//////////console.log(userBlogs.playerstats.stats)


//////GET RECENTLY PLAYED BY PLAYER ID
//////http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+process.env.APIkey+'&steamid=76561198134108288&format=json'
////////console.log(userBlogs.games) route undetermined!


////JAWSDB_URL
////mysql://nubeog4x71j27473:uqxxo4tw0h34flvt@o2olb7w3xv09alub.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/u4l4oqwe1c8h1drk

//////GET NEWS BY APP ID :::: http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json



///////////getOwnedGames parsed object in array
// {"appid":2600,
// "name":"Vampire: The Masquerade - Bloodlines",
// "playtime_forever":1813,
//"img_icon_url":"9fd08d0034ba09d371e1f1a179a0a3af6c36d1f0",
//"playtime_windows_forever":0,
//"playtime_mac_forever":0,"playtime_linux_forever":0,
//"rtime_last_played":1513845169}
// gamesData = JSON.stringify(parsedGames.response.games[0])



// {"appid":440,"newsitems":[{"gid":"4732747437206292836","title":"Team Fortress 2 Update Released","url":"https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/4732747437206292836","is_external_url":true,"author":"erics","contents":"An update to Team Fortress 2 has been released. The update will be applied automatically when you restart Team Fortress 2. The major changes include: Fixed missing footer descriptions for the Gargoyle Case and the Creepy Crawly Case Updated Beaten and Bruised Improved head bandage/bandaids clipping ...","feedlabel":"Community Announcements","date":1667584223,"feedname":"steam_community_announcements","feed_type":1,"appid":440,"tags":["patchnotes"]},{"gid":"4732747437206299777","title":"Team Fortress 2 update for 4 November 2022","url":"https://steamstore-a.akamaihd.net/news/externalpost/SteamDB/4732747437206299777","is_external_url":true,"author":"SteamDB","contents":"<a href=\"https://steamdb.info/patchnotes/9872056/?utm_source=Steam&utm_medium=Steam&utm_campaign=SteamRSS\"> Read patchnotes on SteamDB...</a>","feedlabel":"SteamDB","date":1667584043,"feedname":"SteamDB","feed_type":0,"appid":440},{"gid":"4732747437206293314","title":"Team Fortress 2 Update Released","url":"https://store.steampowered.com/news/155500/","is_external_url":false,"author":"Valve","contents":"An update to Team Fortress 2 has been released. The update will be applied automatically when you restart Team Fortress 2. The major changes include: * Fixed missing footer descriptions for the Gargoyle Case and the Creepy Crawly Case; * Updated Beaten and Bruised; * Improved head bandage/bandaids c...","feedlabel":"Product Update","date":1667581680,"feedname":"steam_updates","feed_type":0,"appid":440}],"count":3299}}
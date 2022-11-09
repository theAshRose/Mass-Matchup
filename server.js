const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const request = require('request');
require('dotenv').config();


const routes = require("./controllers");
const sequelize = require("./config/connection");
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 864000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
process.env.APIkey
app.get('/tester', function(req, res) {
  // var qParams = [];
  // for (var p in req.query) {
  //   qParams.push({'name':p, 'value':req.query[p]})
  //   }http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=76561197960435530
              
    var url = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+process.env.APIkey+'&steamid=76561198134108288&format=json'
    request(url, function(err, response, body) {
      if(!err && response.statusCode < 400) {
        console.log(body);
        res.json(body);
        const userRecentlyPlayed =  JSON.parse(body)
        // console.log(userRecentlyPlayed)
        console.log(userRecentlyPlayed.response.games[0].appid)
        console.log(userRecentlyPlayed.response.games[0].name)
        console.log(userRecentlyPlayed.response.games[0].playtime_forever)
      }
    });	
  }); 


app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});


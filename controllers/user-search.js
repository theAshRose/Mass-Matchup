const router = require("express").Router();
const { User, Friend, FriendReq } = require("../models");
require("dotenv").config();
const request = require("request");
var rp = require("request-promise");
const { parse } = require("handlebars");

const { Op } = require("sequelize");

router.post("/results", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
        req.session.search = req.body.username
        console.log(req.session.search+'string')
        res.status(200).send(req.body.username)
    //     console.log(req.body.username+"HERE")
    //   const userResults1 = await User.findAll({
    //     where: {
    //       username: req.body.username,
    //     },
    //   });
      //username:{ [Op.like]: `%${req.body.search}%` }
      //   req.session.search = usercontent;
    
    //   console.log(userResults+"string")
    //   res.render("search2", {
    //     userResults,
    //     loggedIn: req.session.loggedIn,
    //   });
    //   res.status(200).send(usercontent);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});
// router.get("/content", async (req, res) => {
//   if (!req.session.loggedIn) {
//     res.redirect("/login");
//   } else {
//     try {
//       userResults = req.session.search;
//       console.log(userResults)
//       res.render("search2", {
//          userResults,
//          loggedIn: req.session.loggedIn });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json(err);
//     }
//   }
// });
router.get("/content", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
        console.log(req.session.search+'string')
        const userStuff = await User.findAll({
            where: {
              username: req.session.search,
            },
          });



let userResults = JSON.stringify(userStuff)
      console.log(userResults)
      res.render("search2", {
         userResults,
         loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});
module.exports = router;

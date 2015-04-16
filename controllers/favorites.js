var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");

router.use(bodyParser.urlencoded({extended:false}));


//Grabs favorited recipes and renders


router.post("/", function(req,res){
  var user=req.getUser();
  db.favorite.findOrCreate ({where:{recipeName:req.body.Title, source:req.body.UserName, recId:req.body.RecipeID, image:req.body.ImageURL, userId:user.id}})
    .spread(function(foundEntry,created){
      foundEntry.save().then(function(){
        console.log("HELLO" + foundEntry);
        console.log(created);

        // res.send({data:foundEntry})
        res.redirect("my-recipes")
      })
    })
})












module.exports = router;
var express = require('express');
var session = require ("express-session");
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");

router.use(bodyParser.urlencoded({extended:false}));


//Grabs favorited recipes and renders


router.post("/", function(req,res){
  var user=req.getUser();
  var alerts = req.flash();
  res.locals.user=req.getUser();

  if (!user) {
    console.log('not user');
    // req.flash('danger', 'You have to be logged in to access this page!')
    res.render('index')
 } else {
  console.log('is user');
  db.favorite.findOrCreate ({where:{recipeName:req.body.Title, source:req.body.UserName, recId:req.body.RecipeID, image:req.body.ImageURL, userId:user.id}})
    .spread(function(foundEntry,created){
      foundEntry.save().then(function(){
        console.log("HELLO" + foundEntry);
        console.log(created);

        // res.send({data:foundEntry})
        res.redirect("my-recipes")
      })
    })
  }
})

router.delete("/:recId", function(req,res){
  db.favorite.destroy({where:{recId:req.params.recId}}).then(function(){
    console.log({result:true})
  })

  console.log(req.params.RecipeID)
})

//Deletes favorite
// router.delete("/:id", function(req,res){
//   db.favorite.destroy({where:{imdbid:req.params.id}}).then(function(){
//     res.send({result:true})
//   })
//   console.log(req.params.id)
// })










module.exports = router;
var express = require('express');
var session = require ("express-session");
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");
var flash=require('connect-flash');

router.use(bodyParser.urlencoded({extended:false}));


//Grabs favorited recipes and renders

router.post("/", function(req,res){
  var user=req.getUser();
  // var alerts = req.flash();
  res.locals.user=req.getUser();

  if (!user) {
    console.log('not user');
    req.flash('danger', 'Please login to access that page!');

    // res.render('index',{alerts:req.flash()});
    res.redirect(req.headers.referer)
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


router.delete("/:id", function(req,res){
  db.ingredient.destroy({where:{id:req.params.id}}).then(function(){
    console.log({result:true})
  })

  console.log(req.params.id)
})




router.delete("/:recId", function(req,res){
  db.favorite.destroy({where:{recId:req.params.recId}}).then(function(){
    console.log({result:true})
  })

  console.log(req.params.RecipeID)
})



module.exports = router;
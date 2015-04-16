var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");

//Grabs list and creates a new ingredient associated with it

router.post("/:listId/additem", function(req,res){
  db.list.find({where:{listId:user.lists.id}}).then(function(foundList){
    var myList=req.params.listId
    db.ingredient.create({}).then(function(createdItem){
      foundList.addIngredient(createdItem)

      res.redirect("/ingredients/" + myList + "/additem")
    })
  })

})






module.exports = router;
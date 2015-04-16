var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");

//Grabs list and creates a new ingredient associated with it

router.post("/:listId/additem", function(req,res){

  var user=req.getUser();
  console.log("HELLO IM HERE!")
  db.list.find({where:{listId:user.lists.id}}).then(function(foundList){
    // res.send('FOUNDLIST', foundlist)
    var myList=user.list.id
    db.ingredient.create({name:req.body.itemName, quantity:req.body.itemQty, units:req.body.units}).then(function(createdItem){
      foundList.addIngredient(createdItem)

      console.log('CREATEDITEM', createdItem)
      res.redirect("/ingredients/" + myList + "/additem")
    })
  })

})






module.exports = router;
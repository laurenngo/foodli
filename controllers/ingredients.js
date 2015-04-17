var express = require('express');
var session = require ("express-session");
var bodyParser = require('body-parser');
var router = express.Router();
var request = require("request");
var db=require("../models");


//item.name = toTitleCase(item.name);
var toTitleCase = function(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Grabs list and creates a new ingredient associated with it

// router.post("/:listId/additem", function(req,res){

//   var user=req.getUser();
//   console.log("HELLO IM HERE!")
//   db.list.find({where:{listId:user.lists.id}}).then(function(foundList){
//     // res.send('FOUNDLIST', foundlist)
//     var myList=user.list.id
//     db.ingredient.create({name:req.body.itemName, quantity:req.body.itemQty, units:req.body.units}).then(function(createdItem){
//       foundList.addIngredient(createdItem)

//       console.log('CREATEDITEM', createdItem)
//       res.redirect("/ingredients/" + myList + "/additem")
//     })
//   })

// })

// router.get("/:listId/additem", function(req,res){
//   var user=req.getUser();

//   db.list.find({where:{id:user.lists.id}}).then(function(foundData){
//     console.log(foundData)

//     db.ingredient.findAll({where:{listId:user.lists.id}}).then(function(ingredientData){
//       res.render("list", {currUserList:foundList, currIngredients:ingredientData})
//     })
//   })
// })






module.exports = router;
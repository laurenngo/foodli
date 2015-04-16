var express = require('express');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");


var bigOvenId=process.env.BIGOVEN_KEY;



//GET for recipe search
router.get('/search',function(req,res){

// res.send(bigOvenId)
var url='http://api.bigoven.com/recipes';

var data = {
    pg:1,   //page num
    api_key: process.env.BIGOVEN_KEY,
    rpp:50,  //request per page
    any_kw:req.query.q
  };
  //?pg=1&rpp=25&title_kw=taco&api_key=...

  // res.send(data);

  request(
  {
    url:url,
    qs:data,
    headers:{
      'Accept':'application/json'
    }
  },function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log('body',body);
      var searchData = JSON.parse(body);
      res.render('recipe-results',searchData);
      // res.send(searchData)
    }else{
      res.send('something went wrong.');
      console.log('error',error,response);
    }
  });

});


//GET for specific recipe pages

router.get("/:RecipeID", function(req,res){
  var recipeID = req.params.RecipeID
  var api_key= process.env.BIGOVEN_KEY;
  var url = "http://api.bigoven.com/recipe/" + recipeID + "?api_key="+api_key;

  var recipeData = request(
  {
    url:url,
    headers:{
      'Accept':'application/json'
    }
  }, function(error,response,body) {
    if (!error && response.statusCode == 200) {
            // console.log('body',body);
            var recipeData = JSON.parse(body);
            res.render('show',recipeData);

            // res.send(recipeData)
          }else{
            res.send('something went wrong.');
            console.log('error',error,response);
          }
        });
});

//GET to move recipe ingredients to grocery list

router.get("/mylist/add-recipe/:RecipeID", function(req,res){

  var user=req.getUser();

  //check for stuff ... leave on error
  if(!user) return res.send('You must be logged in!!');
  if(!user.lists) return res.send('You do not have a list');

  var recipeID = req.params.RecipeID
  var api_key= process.env.BIGOVEN_KEY;
  var url = "http://api.bigoven.com/recipe/" + recipeID + "?api_key="+api_key;

  var recipeData = request(
  {
    url:url,
    headers:{
      'Accept':'application/json'
    }
  },
  function(error,response,body) {
    if (!error && response.statusCode == 200) {
      console.log('Data was received');
      var recipeData = JSON.parse(body);
      // console.log('HERE',body)
      console.log("RDATA!!", recipeData)
      console.log('INGREDIENTS',recipeData.Ingredients)

      var newIngredients = recipeData.Ingredients
      .filter(function(rItem) {
        return (!rItem.IsHeading)
      })
      .map(function(item){
        console.log("****************")
        console.log(user.lists);
        console.log(item)
        return {
          name: item.Name,
          quantity: item.Quantity,
          unit: item.Unit,
          ingId: item.IngredientID,
          department: item.IngredientInfo.Department,
          listId: user.lists[0].id
        }
      })
      console.log(newIngredients)

        db.ingredient.bulkCreate(newIngredients)
        .then(function(ingredient){
            console.log(ingredient);
            res.redirect("/list");
            // res.render("add-item", {ingredient:ingredient})
           // res.send("going to ingredient page");
        }).catch(function(err){
          console.log("error", err);
        })


  } else{
    res.send('something went wrong.');
    console.log('error',error,response);
  }
}
);
    });





module.exports = router;

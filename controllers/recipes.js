var express = require('express');
var router = express.Router();
var app = express();
var request = require("request");
var db=require("../models");


// var bigOvenId=process.env.BIGOVEN_KEY;

// Bigoven.set('api_key', process.env.API_KEY)

router.get('/search',function(req,res){

// res.send(bigOvenId)
  var url='http://api.bigoven.com/recipes';

  var data = {
    pg:1,   //page num
    api_key: "dvx773rEY13tPhPgc7LF3FzI368FdCVc",
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





module.exports = router;

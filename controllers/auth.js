// var bcrypt = require('bcrypt');
// var db = require('../models');
// var express = require('express');
// var router = express.Router();

// //POST /auth/signup
// //create new user in database
// router.post('/',function(req,res){
//     //do sign up here (add user to database)

//     var userQuery={email:req.body.email};
//     var userData={email:req.body.email,
//                   username:req.body.username,
//                   password:req.body.password
//                 };

//     db.user.findOrCreate({where:userQuery,defaults:userData})
//     .spread(function(user,created){
//       if(created){
//         res.send('new user created.');
//       } else {
//         res.send('e-mail already exists.');
//       }

//     })
//     .catch(function(error){
//       console.log('ERROR',error);
//       res.send(error);
//     })

//     // res.send(req.body);
//     //user is signed up forward them to the home page
//     // res.redirect('/');
// });



// module.exports = router;
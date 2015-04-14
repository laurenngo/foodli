"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    username: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      validate:{
        isEmail:{
          args:true,
          msg:"Please enter a valid email address."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate:{
        len:{
          args:[8,200],
          msg:"Password must be 8 characters"
        }
      }
     }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks:{
      beforeCreate:function(user,options,sendback){
        bcrypt.hash(user.password,10,function(err,hash){
        if(err) {throw err;}
        user.password= hash;
        sendback(null,user);

        })
      }
    }
  });
  return user;
};
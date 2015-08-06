"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      validate:{
        len:{
          args:[6,200],
          msg:"Your username must be at least 6 characters."
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      validate:{
        isEmail:{

          msg:"Please enter a valid email address."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate:{
        len:{
          args:[8,200],
          msg:"Password must be at least 8 characters."
        }
      }
     }
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.favorite);
        models.user.hasMany(models.list);
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
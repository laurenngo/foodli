"use strict";
module.exports = function(sequelize, DataTypes) {
  var favorite = sequelize.define("favorite", {
    recipeName: DataTypes.TEXT,
    source: DataTypes.STRING,
    recId: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return favorite;
};
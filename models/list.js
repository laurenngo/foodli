"use strict";
module.exports = function(sequelize, DataTypes) {
  var list = sequelize.define("list", {
    listName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.list.belongsTo(models.user);
        models.list.hasMany(models.ingredient);
      }
    }
  });
  return list;
};
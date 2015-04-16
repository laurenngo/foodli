"use strict";
module.exports = function(sequelize, DataTypes) {
  var ingredient = sequelize.define("ingredient", {
    name: DataTypes.TEXT,
    quantity: DataTypes.STRING,
    unit: DataTypes.STRING,
    ingId: DataTypes.INTEGER,
    department: DataTypes.STRING,
    listId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.ingredient.belongsTo(models.list);
      }
    }
  });
  return ingredient;
};
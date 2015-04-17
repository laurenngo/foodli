"use strict";

//item.name = toTitleCase(item.name);
var toTitleCase = function(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports = function(sequelize, DataTypes) {
  var ingredient = sequelize.define("ingredient", {
    name: DataTypes.TEXT,
    quantity: DataTypes.FLOAT,
    unit: DataTypes.STRING,
    ingId: DataTypes.INTEGER,
    department: DataTypes.STRING,
    listId: DataTypes.INTEGER
  }, {
    hooks:{
      beforeCreate:function (ingredient,options){
        // ingredient.name=toTitleCase(ingredient.name);
        ingredient.department=toTitleCase(ingredient.department);
        // ingredient.unit=toTitleCase(ingredient.unit);
    }
  },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.ingredient.belongsTo(models.list);
      }
    }
  });
  return ingredient;
};
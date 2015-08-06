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
      beforeBulkCreate: function(ingredient,options){
        console.log("*********************************", ingredient)
        for (var i=0; i<ingredient.length; i++){
         if (ingredient[i].dataValues.name) {
        ingredient[i].dataValues.name=toTitleCase(ingredient[i].dataValues.name);
        }
        if (ingredient[i].dataValues.department) {
        ingredient[i].dataValues.department=toTitleCase(ingredient[i].dataValues.department);
        }
        if (ingredient[i].dataValues.unit) {
        ingredient[i].dataValues.unit=toTitleCase(ingredient[i].dataValues.unit);
        }
      }
    },
      beforeCreate:function (ingredient,options){
        ingredient.name=toTitleCase(ingredient.name);
        ingredient.department=toTitleCase(ingredient.department);
        ingredient.unit=toTitleCase(ingredient.unit);
    }
  },
    classMethods: {
      associate: function(models) {
        models.ingredient.belongsTo(models.list);
      }
    }
  });
  return ingredient;
};
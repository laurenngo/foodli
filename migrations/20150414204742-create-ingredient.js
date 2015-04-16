"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("ingredients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.TEXT
      },
      quantity: {
        type: DataTypes.STRING
      },
      unit: {
        type: DataTypes.STRING
      },
      ingId: {
        type: DataTypes.INTEGER
      },
      department: {
        type: DataTypes.STRING
      },
      listId: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("ingredients").done(done);
  }
};
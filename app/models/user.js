'use strict';
const options = require('../config/options')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true },
    locale: DataTypes.STRING,
  }, Object.assign({
    classMethods: {
      associate: function(models) {
        User.hasMany(models.File, {
          foreignKey: 'owner',
        })
      }
    }
  }, options));
  return User;
};

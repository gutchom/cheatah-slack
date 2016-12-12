'use strict';
const options = require('../config/options')

module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    id: { type: DataTypes.STRING, primaryKey: true },
    belongs_team: DataTypes.STRING,
  }, Object.assign({
    classMethods: {
      associate: function(models) {
        Channel.hasMany(models.File, {
          foreignKey: 'created_channel',
        })
        Channel.belongsTo(models.Team, {
          foreignKey: 'belongs_team',
          targetKey: 'id',
        })
      }
    }
  }, options));
  return Channel;
};

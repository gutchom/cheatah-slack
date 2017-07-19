const options = require('../config/options')

module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('Team', {
    id: { type: DataTypes.STRING, primaryKey: true },
  }, Object.assign({
    classMethods: {
      associate: function(models) {
        Team.hasMany(models.Channel, {
          foreignKey: 'belongs_team',
        })
        Team.hasMany(models.File, {
          foreignKey: 'belongs_team',
        })
      }
    }
  }, options))
  return Team
}

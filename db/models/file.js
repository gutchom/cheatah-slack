const options = require('../config/options')
const handleS3 = require('../../bot/utilities/handle-s3')

module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define('File', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    mime_type: DataTypes.STRING,
    s3_path: DataTypes.STRING,
    is_private: DataTypes.BOOLEAN, // 0: false, 1: true
    belongs_team: DataTypes.STRING,
    created_channel: DataTypes.STRING,
    owner: DataTypes.STRING,
  }, Object.assign({
    classMethods: {
      associate: function(models) {
        File.belongsTo(models.Team, {
          foreignKey: 'belongs_team',
          targetKey: 'id',
        })
        File.belongsTo(models.Channel, {
          foreignKey: 'created_channel',
          targetKey: 'id',
        })
        File.belongsTo(models.User, {
          foreignKey: 'owner',
          targetKey: 'id',
        })
      },
      getAvailableList: function(teamId, channelId) {
        return this.findAll({
          where: {
            belongs_team: teamId,
            $and: {
              $or: [
                { created_channel: channelId },
                { is_private: false }
              ]
            }
          }
        })
      }
    },
    instanceMethods: {
      buildS3Path: function() {
        return handleS3.pathBuilder(this.name, this.belongs_team, this.is_private ? this.created_channel : this.belongs_team)
      },
      overwrite: function() {
        return File.findOne({ where: { s3_path: this.s3_path } })
          .then(olderFile => {
            if (olderFile) olderFile.destroy()
          })
          .then(() => this.save())
      }
    }
  }, options))
  return File
}

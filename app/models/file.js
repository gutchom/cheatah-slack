'use strict';
const options = require('../config/options')
const handleS3 = require('../bot/utilities/handle-s3')

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
      getAvailableList: function({ team, channel }) {
        return this.findAll({
          where: {
            belongs_team: team,
            $and: {
              $or: [
                { created_channel: channel },
                { is_private: false }
              ]
            }
          }
        }).then(files => files.map(file => ({
          id: file.get('id'),
          name: file.get('name'),
          isPrivate: file.get('is_private'),
        })))
          .catch(err => err)
      },
      getText: function({ name, team, channel, isPrivate }) {
        const scope = isPrivate ? channel : team
        const path = handleS3.pathBuilder(name, team, scope)

        return handleS3.downloadTextFile(path)
          .then(data => ({ name, content: data.Body.toString() }))
      },
      saveText: function({ name, content, team, channel, user, isPrivate }) {
        const scope = isPrivate ? channel : team
        const path = handleS3.pathBuilder(name, team, scope)
        const record = {
          name: name,
          mime_type: 'text/plain',
          s3_path: path,
          is_private: isPrivate,
          belongs_team: team,
          created_channel: channel,
          owner: user,
        }

        return handleS3.uploadTextFile(path, content)
          .then(() => this.create(record))
      },
      removeText: function({ name, team, channel, isPrivate }) {
        const scope = isPrivate ? channel : team
        const path = handleS3.pathBuilder(name, team, scope)

        return handleS3.deleteFile(path)
          .then(() => {
            this.destroy({ where: { s3_path: path } })
            return name
          })
      }
    }
  }, options),
  {
    validate: {

    }
  });
  return File;
};

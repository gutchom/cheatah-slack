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
      getAvailableList: function({ teamId, channelId }) {
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
        }).then(files => files.map(file => ({
          id: file.get('id'),
          name: file.get('name'),
          isPrivate: file.get('is_private'),
        })))
          .catch(err => err)
      },
      getText: function({ name, teamId, channelId, isPrivate }) {
        const scope = isPrivate ? channelId : teamId
        const path = handleS3.pathBuilder(name, teamId, scope)

        return handleS3.getTextContent(path)
          .then(content => ({ name, content }))
      },
      saveText: function({ name, content, teamId, channelId, userId, isPrivate }) {
        const scope = isPrivate ? channelId : teamId
        const path = handleS3.pathBuilder(name, teamId, scope)
        const record = {
          name: name,
          mime_type: 'text/plain',
          s3_path: path,
          is_private: isPrivate,
          belongs_team: teamId,
          created_channel: channelId,
          owner: userId,
        }

        return handleS3.uploadTextFile(path, content)
          .then(() => this.findOne({ where: { s3_path: path } }))
          .then(fileData => {
            console.log(fileData)
            if (fileData) {
              return fileData.update(record)
            } else {
              return this.create(record)
            }
          })
      },
      removeText: function({ name, teamId, channelId, isPrivate }) {
        const scope = isPrivate ? channelId : teamId
        const path = handleS3.pathBuilder(name, teamId, scope)

        return handleS3.deleteFile(path)
          .then(() => {
            this.destroy({ where: { s3_path: path } })
            return name
          })
      }
    }
  }, options))
  return File
}

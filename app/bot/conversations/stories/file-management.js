const EVENT_TYPE_MENTIONS = require('../../settings').constants.EVENT_TYPE_MENTIONS
const sentences = require('../../settings/dictionary').sentences
const commands = require('../../settings/dictionary').commands
const inquiries = require('../inquiries')
const handleS3 = require('../../utilities/handle-s3')
const userConfigs = require ('../../settings/userConfigs')
const model = require('../../../models')
const File = model.File
const Channel = model.Channel

function choseFile(bot, message, files, title) {
  const duplicates = files.filter(file => file.get('name') === title)
  if (duplicates.length > 1) {
    return inquiries.askFromOrderedList(bot, message, duplicates.map(file => file.get('name')))
      .then(chosen => duplicates[chosen])
  } else if (duplicates.length > 0) {
    return duplicates[0]
  } else {
    return inquiries.askFromOrderedList(bot, message, files.map(file => file.get('name')))
      .then(chosen => {
        return files[chosen]
      })
  }
}

// conversation stories about note list management
module.exports = function fileManagement(controller) {

  // The case an user wants to add or overwrite note
  controller.hears(commands.add, EVENT_TYPE_MENTIONS, (bot, message) => {
    const title = message.match[1]
    const teamId = message.team
    const channelId = message.channel
    const userId = message.user
    const locale = userConfigs.getValue('locale', userId)

    File.getAvailableList(teamId, channelId)
      .then(files => {
        const file = File.build({
          mime_type: 'text/plain',
          belongs_team: teamId,
          created_channel: channelId,
          owner: userId
        })

        if (files.find(file => file.get('name') === title)) {
          file.name = title
          return inquiries.askConfirm(bot, message, `*${title}* ${sentences.alreadyExists[locale]}`)
            .then(answer => answer ? file : Promise.reject('quit'))
        } else if (title) {
          file.name = title
          return file
        } else {
          return inquiries.askText(bot, message, sentences.askTitle[locale])
            .then(name => {
              file.name = name
              if (files.find(file => file.get('name') === name)) {
                return inquiries.askConfirm(bot, message, `*${name}* ${sentences.alreadyExists[locale]}`)
                  .then(answer => answer ? file : Promise.reject('quit'))
              } else {
                return file
              }
            })
        }
      })
      .then(file => Channel.findOrCreate({ where: { id: channelId }, defaults: { belongs_team: teamId } })
        .then(() => file)
      )
      // Set scope (private/public) according to channel condition
      .then(file => {
        return new Promise((resolve, reject) => {
          bot.api.channels.list({}, (err, res) => {
            if (err) reject(err)
            const isPublicChannel = Boolean(res.channels.find(channel => channel.id === channelId))
            file.is_private = !isPublicChannel
            resolve(file)
          })
        })
      })
      .then(file => inquiries.askText(bot, message, sentences.postContent[locale])
        .then(content => ({ file, content }))
      )
      .then(({ file, content }) => {
        const path = file.buildS3Path()
        const name = file.get('name')
        file.s3_path = path
        return handleS3.uploadTextFile(path, content)
          .then(() => file.overwrite())
          .then(() => name)
      })
      .then(name => bot.reply(message, `*${name}* ${sentences.saved[locale]}${sentences.finish[locale]}`))
      .catch(err => err === 'quit'
        ? bot.reply(message, sentences.roger[locale] + sentences.finish[locale])
        : bot.reply(message, sentences.error[locale] + sentences.abort[locale])
      )
  })

  // The case an user wants to remove file
  controller.hears(commands.remove, EVENT_TYPE_MENTIONS, (bot, message) => {
    const title = message.match[1]
    const teamId = message.team
    const channelId = message.channel
    const userId = message.user
    const locale = userConfigs.getValue('locale', userId)

    File.getAvailableList(teamId, channelId)
      .then(files => choseFile(bot, message, files, title))
      .then(file => {
        return inquiries.askConfirm(bot, message, `*${file.get('name')}* ${sentences.removing[locale]}`)
            .then(answer => answer ? file : Promise.reject('quit'))
      })
      .then(file => {
        const path = file.buildS3Path()
        const name = file.get('name')
        return handleS3.deleteFile(path)
          .then(() => file.destroy())
          .then(() => name)
      })
      .then(name => bot.reply(message, `*${name}* ${sentences.removed[locale]}`))
      .catch(err => err === 'quit'
        ? bot.reply(message, sentences.roger[locale] + sentences.finish[locale])
        : bot.reply(message, sentences.error[locale] + sentences.abort[locale])
      )
  })

  // The case an user wants to find and get existing note
  controller.hears(commands.show, EVENT_TYPE_MENTIONS, (bot, message) => {
    const title = message.match[1]
    const teamId = message.team
    const channelId = message.channel
    const userId = message.user
    const locale = userConfigs.getValue('locale', userId)

    File.getAvailableList(teamId, channelId)
      .then(files => choseFile(bot, message, files, title))
      .then(file => {
        const path = file.buildS3Path()
        return handleS3.downloadTextFile(path)
          .then(data => ({ name: file.get('name'), content: data.Body.toString() }))
      })
      .then(({ name, content }) => bot.reply(message, `*${name}*\n\n${content}`))
      .catch(() => bot.reply(message, sentences.error[locale] + sentences.abort[locale]))
  })
}

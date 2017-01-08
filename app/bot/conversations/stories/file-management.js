const EVENT_TYPE_MENTIONS = require('../../settings').constants.EVENT_TYPE_MENTIONS
const sentences = require('../../settings/dictionary').sentences
const commands = require('../../settings/dictionary').commands
const inquiries = require('../inquiries')
const userConfigs = require ('../../settings/userConfigs')
const model = require('../../../models')
const File = model.File

// conversation stories about note list management
module.exports = function fileManagement(controller) {
  // The case an user wants to add or overwrite note
  controller.hears(commands.add, EVENT_TYPE_MENTIONS, (bot, message) => {
    console.log(`[Cheatah]: hears ${message.match}`)
    const title = message.match[1]
    const team = message.team
    const channel = message.channel
    const user = message.user
    const locale = userConfigs.getValue('locale', user)

    File.getAvailableList({ team, channel })
      .then(files => {
        if (files.find(file => file.name === title)) {
          return inquiries.askConfirm(bot, message, `*${title}* ${sentences.alreadyExists[locale]}`)
            .then(answer => {
              if (answer) {
                return title
              } else {
                throw new Error('quit')
              }
            })
        } else {
          return title || inquiries.askText(bot, message, sentences.askTitle[locale])
        }
      })
      .then(name => inquiries.askText(bot, message, sentences.postContent[locale])
        .then(content => ({ name, content }))
      )
      .then(({ name, content }) => inquiries.askConfirm(bot, message, sentences.isPrivate[locale])
        .then(isPrivate => ({ name, content, isPrivate: !isPrivate }))
      )
      .then(({ name, content, isPrivate }) => File.removeText({ name, team, channel, isPrivate })
        .then(() => ({ name, content, isPrivate }))
      )
      .then(({ name, content, isPrivate }) => File.saveText({ name, content, team, channel, user, isPrivate })
        .then(() => name)
      )
      .then(name => bot.reply(message, `*${name}* ${sentences.saved[locale]}${sentences.finish[locale]}`))
      .catch(err => err.message === 'quit'
        ? bot.reply(message, sentences.roger[locale] + sentences.finish[locale])
        : bot.reply(message, sentences.error[locale] + sentences.abort[locale])
      )
  })

  // The case an user wants to find and get existing note
  controller.hears(commands.show, EVENT_TYPE_MENTIONS, (bot, message) => {
    console.log(`[Cheatah]: hears ${message.match}`)
    const title = message.match[1]
    const team = message.team
    const channel = message.channel
    const user = message.user
    const locale = userConfigs.getValue('locale', user)

    File.getAvailableList({ team, channel })
      .then(files => {
        const duplicates = files.filter(file => file.name === title)
        if (duplicates.length >= 2) {
          return inquiries.askFromOrderedList(bot, message, duplicates.map(file => file.name))
            .then(chosen => duplicates[chosen])
        } else if (duplicates.length > 0) {
          return duplicates[0]
        } else {
          return inquiries.askFromOrderedList(bot, message, files.map(file => file.name))
            .then(chosen => files[chosen])
        }
      })
      .then(({ name, isPrivate }) => File.getText({ name, team, channel, isPrivate }))
      .then(({ name, content }) => bot.reply(message, `*${name}*\n\n${content}`))
      .catch(() => bot.reply(message, sentences.error[locale] + sentences.abort[locale]))
  })

  // The case an user wants to remove file
  controller.hears(commands.remove, EVENT_TYPE_MENTIONS, (bot, message) => {
    console.log(`[Cheatah]: hears ${message.match}`)
    const title = message.match[1]
    const team = message.team
    const channel = message.channel
    const user = message.user
    const locale = userConfigs.getValue('locale', user)

    File.getAvailableList({ team, channel })
      .then(files => {
        const duplicates = files.filter(file => file.name === title)
        if (duplicates.length >= 2) {
          return inquiries.askFromOrderedList(bot, message, duplicates.map(file => file.name))
            .then(chosen => duplicates[chosen])
        } else if (duplicates.length > 0) {
          return duplicates[0]
        } else {
          return inquiries.askFromOrderedList(bot, message, files.map(file => file.name))
            .then(chosen => files[chosen])
        }
      })
      .then(({ name, isPrivate }) => inquiries.askConfirm(bot, message, `*${name}* ${sentences.removing[locale]}`)
        .then(answer => {
          if (answer) {
            return { name, isPrivate }
          } else {
            throw new Error('quit')
          }
        })
      )
      .then(({ name, isPrivate }) => File.removeText({ name, team, channel, isPrivate }))
      .then(name => bot.reply(message, `*${name}* ${sentences.removed[locale]}`))
      .catch(err => err.message === 'quit'
        ? bot.reply(message, sentences.roger[locale] + sentences.finish[locale])
        : bot.reply(message, sentences.error[locale] + sentences.abort[locale])
      )
  })

  controller.hears(commands.list, EVENT_TYPE_MENTIONS, (bot, message) => {
    console.log(`[Cheatah]: hears ${message.match}`)
    const team = message.team
    const channel = message.channel
    const user = message.user
    const locale = userConfigs.getValue('locale', user)

    File.getAvailableList({team, channel})
      .then(files => files.map((file, order) => `${order + 1}. ${file.name}`).join('\n'))
      .then(list => bot.reply(message, list))
  })
}

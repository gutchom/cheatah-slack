const fileManager = require('./file-managers.js')
const conversations = require('./conversations')
const vocabulary = require('./localize-dictionary')
const PATH_TO_FILES = './data/cheatah/'
const LOCALE = process.env.LOCALE || 'en'
const EVENT_TYPE_MENTIONS = ['direct_message', 'direct_mention', 'mention']

module.exports = function hearings (controller) {
  controller.hears('show', EVENT_TYPE_MENTIONS, (bot, message) => {
    const commands = message.text.split(' ')
    const fileName = commands[1]
    fileManager.getLocalFileList(PATH_TO_FILES)
      .then(list => list.find(title => title === fileName) || conversations.askFileNameFromList(bot, message, list))
      .then(title => fileManager.getLocalFile(PATH_TO_FILES + title, title))
      .then(([title, file]) => bot.reply(message, `*${title}*\n\n${file}`))
      .catch(err => err === 'quit'
        ? bot.reply(message, vocabulary.roger[LOCALE])
        : bot.reply(message, vocabulary.error[LOCALE] + vocabulary.abort[LOCALE]))
  })
  controller.hears('add', EVENT_TYPE_MENTIONS, (bot, message) => {
    const commands = message.text.split(' ')
    const fileName = commands[1]
    fileManager.getLocalFileList(PATH_TO_FILES)
      .then(list => list.find(title => title === fileName)
        ? conversations.askConfirm(bot, message, fileName, vocabulary.alreadyExists[LOCALE])
        : fileName)
      .then(title => title || conversations.askNewFileName(bot, message))
      .then(title => conversations.askNewFileContent(bot, message, title))
      .then(([title, content]) => fileManager.saveLocalFile(PATH_TO_FILES + title, title, content))
      .then(title => bot.reply(message, `*${title}* ${vocabulary.saved[LOCALE]}`))
      .catch(err => err === 'quit'
        ? bot.reply(message, vocabulary.roger[LOCALE])
        : bot.reply(message, vocabulary.error[LOCALE] + vocabulary.abort[LOCALE]))
  })
  controller.hears('remove', EVENT_TYPE_MENTIONS, (bot, message) => {
    const commands = message.text.split(' ')
    const fileName = commands[1]
    fileManager.getLocalFileList(PATH_TO_FILES)
      .then(list => list.find(title => title === fileName) || conversations.askFileNameFromList(bot, message, list))
      .then(title => conversations.askConfirm(bot, message, title, `*${title}* ${vocabulary.removing[LOCALE]}`))
      .then(title => fileManager.deleteLocalFile(PATH_TO_FILES + title, title))
      .then(title => bot.reply(message, `*${title}* ${vocabulary.removed[LOCALE]}`))
      .catch(err => err === 'quit'
        ? bot.reply(message, vocabulary.roger[LOCALE])
        : bot.reply(message, vocabulary.error[LOCALE] + vocabulary.abort[LOCALE]))
  })
  controller.hears('help', EVENT_TYPE_MENTIONS, (bot, message) => {
    fileManager.getLocalFile('./README.md').then(file => bot.reply(message, `${file}`))
  })
}

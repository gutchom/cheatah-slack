const userConfigs = require('../../settings/userConfigs')
const sentences = require('../../settings/dictionary').sentences
const commands = require('../../settings/dictionary').commands
const localesSet = require('../../settings').conditions.locales
const EVENT_TYPE_MENTIONS = require('../../settings').constants.EVENT_TYPE_MENTIONS
const inquiries = require('../inquiries/index')
const handleS3 = require('../../utilities/handle-s3')
const User = require('../../../../app/db/models/index').User

module.exports = function appConfiguration(controller) {
  controller.hears('help', EVENT_TYPE_MENTIONS, (bot, message) => {
    handleS3.downloadTextFile('cheatah-slack/static-files/help')
      .then(data => data.Body.toString())
      .then(content => bot.reply(message, content))
  })

  controller.hears(commands.locale, EVENT_TYPE_MENTIONS, (bot, message) => {
    const request = message.match[1]
    const locale = userConfigs.getValue('locale', message.user)
    const nextLang = localesSet.find(lang => lang.pattern.test(request))

    if (nextLang) {
      inquiries.askConfirm(bot, message, sentences.localeChanging[locale](nextLang.dict[locale]))
        .then(answer => answer ? nextLang.code : bot.reply(message, sentences.roger[locale] + sentences.finish[locale]))
        .then(localeCode => User.findById(message.user)
          .then(user => ({ user, localeCode }))
        )
        .then(({ user, localeCode }) => {
          user.set('locale', localeCode)
          return user.save()
            .then(() => localeCode)
        })
        .then(localeCode => userConfigs.setValue('locale', message.user, localeCode))
        .then(() => bot.reply(message, sentences.localeChanged[userConfigs.getValue('locale', message.user)]))
        .catch(() => bot.reply(message, sentences.error[locale] + sentences.abort[locale]))
    }
  })
}

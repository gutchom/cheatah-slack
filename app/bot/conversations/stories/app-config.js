const setValue = require('../../store').setValue
const getValue = require('../../store').getValue
const sentence = require('../../settings/dictionary').sentence
const command = require('../../settings/dictionary').command
const localesSet = require('../../settings').conditions.locales
const EVENT_TYPE_MENTIONS = require('../../settings').constants.EVENT_TYPE_MENTIONS
const inquiries = require('../inquiries')
const handleS3 = require('../../utilities/handle-s3')
const User = require('../../../models').User

module.exports = function appConfiguration(controller) {
  controller.hears('help', EVENT_TYPE_MENTIONS, (bot, message) => {
    handleS3.downloadTextFile('cheatah-slack/static-files/help')
      .then(data => data.Body.toString())
      .then(content => bot.reply(message, content))
  })

  controller.hears(command.locale, EVENT_TYPE_MENTIONS, (bot, message) => {
    const request = message.match[1]
    const locale = getValue('locale', message.user)
    const nextLang = localesSet.find(lang => lang.pattern.test(request))

    if (nextLang) {
      inquiries.askConfirm(bot, message, sentence.localeChanging[locale](nextLang.dict[locale]))
        .then(answer => answer ? nextLang.code : bot.reply(message, sentence.roger[locale] + sentence.finish[locale]))
        .then(localeCode => User.findById(message.user)
          .then(user => ({ user, localeCode }))
        )
        .then(({ user, localeCode }) => {
          user.set('locale', localeCode)
          return user.save()
            .then(() => localeCode)
        })
        .then(localeCode => setValue('locale', message.user, localeCode))
        .then(() => bot.reply(message, sentence.localeChanged[getValue('locale', message.user)]))
        .catch(() => bot.reply(message, sentence.error[locale] + sentence.abort[locale]))
    }
  })
}

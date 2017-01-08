const userConfigs = require('../../settings/userConfigs')
const sentences = require('../../settings/dictionary').sentences
const phrases = require('../../settings/dictionary').phrases

function abortConvo(convo, locale, res) {
  if (phrases.abort.test(res.text)) {
    convo.say(sentences.timeUp[locale])
    convo.say(sentences.abort[locale])
    convo.stop()
  }
}

function askText(bot, message, question) {
  const locale = userConfigs.getValue('locale', message.user)

  return new Promise((resolve, reject) => {
    bot.startConversation(message, (err, convo) => {
      if (err) reject(err)

      convo.ask(question, (res, convo) => {
        abortConvo(convo, locale, res)
        convo.stop()
        resolve(res.text)
      })
    })
  })
}

// Return boolean by asking y/n alternative
function askConfirm(bot, message, caution) {
  const locale = userConfigs.getValue('locale', message.user)

  return new Promise((resolve, reject) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(caution)

      convo.ask(sentences.confirm[locale], (res, convo) => {
        abortConvo(convo, locale, res)

        if (phrases.yes.test(res.text)) {
          convo.stop()
          resolve(true)
        }
        if (phrases.no.test(res.text)) {
          convo.stop()
          resolve(false)
        }

        convo.say(sentences.tryAgain[locale])
        convo.repeat()
      })
    })
  })
}

// list: Array of Strings
// return: index number of Array
function askFromOrderedList(bot, message, list) {
  const locale = userConfigs.getValue('locale', message.user)

  return new Promise(resolve => {
    bot.startConversation(message, (err, convo) => {
      const orderedList = list.map((option, order) => `${order + 1}. ${option}`).join('\n')

      convo.ask(sentences.chooseFromList[locale] + orderedList, (res, convo) => {
        const choice = parseInt(res.text, 10) - 1
        abortConvo(convo, locale, res)

        if (list[choice]) {
          convo.stop()
          resolve(choice)
        }

        convo.say(sentences.tryAgain[locale])
        convo.repeat()
      })
    })
  })
}

module.exports = {
  askText,
  askConfirm,
  askFromOrderedList,
}

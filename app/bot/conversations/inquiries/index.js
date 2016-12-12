const getValue = require('../../store').getValue
const sentence = require('../../settings/dictionary').sentence
const phrase = require('../../settings/dictionary').phrase

function abortConvo(convo, locale, res) {
  if (phrase.abort.test(res.text)) {
    convo.say(sentence.timeUp[locale])
    convo.say(sentence.abort[locale])
    convo.stop()
  }
}

function askText(bot, message, question) {
  const locale = getValue('locale', message.user)

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
  const locale = getValue('locale', message.user)

  return new Promise((resolve, reject) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(caution)

      convo.ask(sentence.confirm[locale], (res, convo) => {
        abortConvo(convo, locale, res)

        if (phrase.yes.test(res.text)) {
          convo.stop()
          resolve(true)
        }
        if (phrase.no.test(res.text)) {
          convo.stop()
          resolve(false)
        }

        convo.say(sentence.tryAgain[locale])
        convo.repeat()
      })
    })
  })
}

// list: Array of Strings
// return: index number of Array
function askFromOrderedList(bot, message, list) {
  const locale = getValue('locale', message.user)

  return new Promise(resolve => {
    bot.startConversation(message, (err, convo) => {
      const orderedList = list.map((option, order) => `${order + 1}. ${option}`).join('\n')

      convo.ask(sentence.chooseFromList[locale] + orderedList, (res, convo) => {
        const choice = parseInt(res.text, 10) - 1
        abortConvo(convo, locale, res)

        if (list[choice]) {
          convo.stop()
          resolve(choice)
        }

        convo.say(sentence.tryAgain[locale])
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

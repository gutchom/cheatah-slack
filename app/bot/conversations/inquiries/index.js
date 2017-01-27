const userConfigs = require('../../settings/userConfigs')
const sentences = require('../../settings/dictionary').sentences
const phrases = require('../../settings/dictionary').phrases

function askText(bot, message, question) {
  const locale = userConfigs.getValue('locale', message.user)
  return new Promise((resolve, reject) => {
    bot.startConversation(message, (err, convo) => {
      if (err) reject(err)
      convo.ask(question, [
        {
          pattern: phrases.abort,
          callback: () => {
            reject('quit')
          }
        },
        {
          default: true,
          callback: (res, convo) => {
            convo.next()
            resolve(res.text)
          }
        }
      ])
    })
  })
}

// Return boolean by asking y/n alternative
function askConfirm(bot, message, caution) {
  const locale = userConfigs.getValue('locale', message.user)
  return new Promise((resolve, reject) => {
    bot.startConversation(message, (err, convo) => {
      if (err) reject(err)
      convo.say(caution)
      convo.ask(sentences.confirm[locale], [
        {
          pattern: phrases.abort,
          callback: () => {
            reject('quit')
          }
        },
        {
          pattern: phrases.yes,
          callback: (res, convo) => {
            convo.next()
            resolve(true)
          }
        },
        {
          pattern: phrases.no,
          callback: (res, convo) => {
            convo.next()
            resolve(false)
          }
        },
        {
          default: true,
          callback: (res, convo) => {
            convo.say(sentences.tryAgain[locale])
            convo.repeat()
            convo.next()
          }
        }
      ])
    })
  })
}

// list: Array of Strings
// return: index number of Array
function askFromOrderedList(bot, message, list) {
  const locale = userConfigs.getValue('locale', message.user)
  return new Promise(resolve => {
    bot.startConversation(message, (err, convo) => {
      if (err) reject(err)
      const orderedList = list.map((option, order) => `${order + 1}. ${option}`).join('\n')
      convo.ask(sentences.chooseFromList[locale] + orderedList, [
        {
          pattern: phrases.abort,
          callback: () => {
            reject('quit')
          }
        },
        {
          pattern: new RegExp(`[1-${list.length}]`, 'i'),
          callback: (res, convo) => {
            const choice = parseInt(res.text, 10) - 1
            convo.next()
            resolve(choice)
          }
        },
        {
          default: true,
          callback: (res, convo) => {
            convo.say(sentences.tryAgain[locale])
            convo.repeat()
            convo.next()
          }
        }
      ])
    })
  })
}

module.exports = {
  askText,
  askConfirm,
  askFromOrderedList,
}

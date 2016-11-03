const vocabulary = require('./localize-dictionary')
const TIMER_SHORT = 20000
const TIMER_MIDDLE = TIMER_SHORT * 4
const LOCALE = process.env.LOCALE || 'en'

module.exports = {
  conversationTerminateCommand: function (convo, res) {
    if (/(bye|stop|cancel)\s/i.test(res)) {
      convo.say(vocabulary.abort[LOCALE])
      convo.stop()
    }
  },
  conversationTimmer: function (convo, time) {
    const timeLimit = {
      en: `Answer the question in ${time / 1000} seconds.\n`,
      ja: `${time / 1000}秒以内に答えてくれ。\n`
    }
    convo.say(timeLimit[LOCALE])
    setTimeout(() => {
      convo.say(vocabulary.timeUp[LOCALE] + vocabulary.finish[LOCALE])
      convo.stop()
    }, time)
  },
  askNewFileName: function (bot, message) {
    return new Promise(resolve => {
      bot.startConversation(message, (err, convo) => {
        this.conversationTimmer(convo, TIMER_MIDDLE)
        convo.ask(vocabulary.askTitle[LOCALE], (res, convo) => {
          this.conversationTerminateCommand(convo, res.text)
          resolve(res.text)
          convo.stop()
        })
      })
    })
  },
  askNewFileContent: function (bot, message, name) {
    return new Promise(resolve => {
      bot.startConversation(message, (err, convo) => {
        convo.ask(vocabulary.postContent[LOCALE], (res, convo) => {
          this.conversationTerminateCommand(convo, res.text)
          resolve([name, res.text])
          convo.stop()
        })
      })
    })
  },
  // Return boolean by asking y/n alternative
  askConfirm: function (bot, message, through, caution) {
    return new Promise((resolve, reject) => {
      bot.startConversation(message, (err, convo) => {
        this.conversationTimmer(convo, TIMER_SHORT)
        let counter = 0
        convo.say(caution)
        convo.ask(vocabulary.confirm[LOCALE], (res, convo) => {
          this.conversationTerminateCommand(convo, res.text)
          if (res.text === 'yes') {
            resolve(through)
            convo.stop()
          }
          if (res.text === 'no') {
            convo.say(vocabulary.abort[LOCALE])
            reject('quit')
            convo.stop()
          }
          if (counter++ > 2) {
            reject('quit')
            convo.stop()
          }
          convo.say(vocabulary.tryAgain[LOCALE])
          convo.repeat()
        })
      })
    })
  },
  // Return file name String
  askFileNameFromList: function (bot, message, list) {
    return new Promise(resolve => {
      bot.startConversation(message, (err, convo) => {
        this.conversationTimmer(convo, TIMER_SHORT)
        const numberedList = list.map((name, index) => `${index + 1}. ${name}`).join('\n')
        let counter = 0
        convo.ask(vocabulary.fileList[LOCALE] + numberedList, (res, convo) => {
          this.conversationTerminateCommand(convo, res.text)
          const name = list[parseInt(res.text) - 1]
          if (name) {
            resolve(name)
            convo.stop()
          }
          if (counter++ > 2) {
            convo.say(vocabulary.abort[LOCALE])
            reject('quit')
            convo.stop()
          }
          convo.say(vocabulary.tryAgain[LOCALE])
          convo.repeat()
        })
      })
    })
  }
}

const words = require('./dictionary').words

function generateMatchPattern(locales, morePatterns) {
  let spells = []
  Object.keys(locales).forEach(localize => spells.push(locales[localize]))
  if (Array.isArray(morePatterns)) spells = spells.concat(morePatterns)
  return new RegExp(spells.join('|'), 'i')
}

const locales = [
  {
    code: 'en',
    dict: words.english,
    pattern: generateMatchPattern(words.english),
  },
  {
    code: 'ja',
    dict: words.japanese,
    pattern: generateMatchPattern(words.japanese),
  },
  {
    code: 'kansai',
    dict: words.kansaiBen,
    pattern: generateMatchPattern(words.kansaiBen),
  },
]

module.exports.conditions = {
  locales,
}

module.exports.constants = {
  EVENT_TYPE_MENTIONS: ['direct_message', 'direct_mention', 'mention'],
  TIME_SHORT: 30000,
  TIME_MIDDLE: this.TIME_SHORT * 4,
  TIME_LONG: this.TIME_MIDDLE * 4,
}

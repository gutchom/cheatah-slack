const word = require('./dictionary').word

function generateMatchPattern(locales, morePatterns) {
  let spells = []
  Object.keys(locales).forEach(localize => {
    spells.push(locales[localize])
  })
  if (Array.isArray(morePatterns)) spells = spells.concat(morePatterns)
  return new RegExp(spells.join('|'), 'i')
}

const locales = [
  {
    code: 'en',
    dict: word.english,
    pattern: generateMatchPattern(word.english),
  },
  {
    code: 'ja',
    dict: word.japanese,
    pattern: generateMatchPattern(word.japanese),
  },
  {
    code: 'kansai',
    dict: word.kansaiBen,
    pattern: generateMatchPattern(word.kansaiBen),
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

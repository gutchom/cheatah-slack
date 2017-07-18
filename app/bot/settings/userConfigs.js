const userConfigs = {
  locale: {
    initial: 'en',
  },
}

function getValue(key, id) {
  return userConfigs[key][id] || userConfigs[key].initial
}

function setValue(key, id, value) {
  if (!userConfigs.hasOwnProperty(key)) throw new RangeError("'key' argument should be existing property of 'store' object.")
  userConfigs[key][id] = value
}

module.exports = {
  setValue,
  getValue,
}

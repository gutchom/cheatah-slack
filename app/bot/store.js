const store = {
  locale: {
    initial: 'en',
  },
}

function getValue(key, id) {
  return store[key][id] || store[key].initial
}

function setValue(key, id, value) {
  if (!store.hasOwnProperty(key)) throw new RangeError("'key' argument should be existing property of 'store Object.")
  store[key][id] = value
}

module.exports = {
  setValue,
  getValue,
}

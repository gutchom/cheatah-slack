const appConfig = require('./conversations/stories/app-config')
const fileManagement = require('./conversations/stories/file-management')
const userConfigs = require('./settings/userConfigs')
const User = require('../models').User

function init(controller) {
  // Import data from DB
  User.all()
    .then(users => users.map(user => ({ id: user.get('id'), locale: user.get('locale') })))
    .then(users => users.forEach(user => userConfigs.setValue('locale', user.id, user.locale)))

  appConfig(controller)
  fileManagement(controller)
}

module.exports = {
  init,
}

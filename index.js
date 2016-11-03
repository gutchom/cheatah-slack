const Botkit = require('botkit')
const hearings = require('./lib/hearings')
const TOKEN = process.env.SLACK_BOT_TOKEN_CHEATAH

// Abort by failure of API keys
if (!TOKEN) {
  console.log('Error: Required Token')
  process.exit(1)
}

// Create bot instance
const controller = Botkit.slackbot({
  debug: false,
  interactive_replies: true,
  json_file_store: './simple_storage'
})

// Connect to "Real Time Messaging API"
const bot = controller.spawn({
  token: TOKEN
}).startRTM()

// Launch express.js server
controller.setupWebserver(process.env.port || 3000, (err, webserver) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  controller
    .createWebhookEndpoints(controller.webserver)
})

hearings(controller)

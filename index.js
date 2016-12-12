const Botkit = require('botkit')
const port = process.env.PORT
const environment = process.env.NODE_ENV
const clientId = process.env.SLACK_CLIENT
const clientSecret = process.env.SLACK_CLIENT_SECRET
const redirectUri = environment === 'development' ? 'http://localhost:3000/oauth' : 'http://cheatah.suw-arakawa.tokyo/oauth'
const scopes = ['bot', 'commands', 'incoming-webhook']
const app = require('./app/bot').init

// Abort by failure of API keys
if (!(port && clientId && clientSecret)) {
  console.log('Error: Required Token')
  process.exit(1)
}

// Create bot instance
const controller = Botkit.slackbot({
  debug: false,
  interactive_replies: true, // tells botkit to send button clicks into conversations
  json_file_store: './cheatah_db'
}).configureSlackApp({ clientId, clientSecret, redirectUri, scopes })

// Launch express.js server
controller.setupWebserver(port, (err, webserver) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  webserver.get('/', (req,res) => {
    res.send('<a href="https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=18007510821.97951931685"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>');
  })

  controller.createHomepageEndpoint(controller.webserver)

  controller.createOauthEndpoints(controller.webserver, (err, req, res) => {
    if (err) {
      console.log(req)
      res.status(500).send(`ERROR: ${err}`)
    } else {
      console.log(req)
      res.send('Success!')
    }
  })

  controller.createWebhookEndpoints(controller.webserver)
})

// Store the tokens for each team
const _bots = {}
function trackBot(bot) { _bots[bot.config.token] = bot }

// Creating bot on a team for the first time.
controller.on('create_bot', (bot, config) => {
  console.log('[created_bot]: start')
  if (_bots[bot.config.token]) {
    console.log('Already online in this team!')
  } else {
    bot.startRTM(err => {
      if (!err) trackBot(bot)
      bot.startPrivateConversation({ user: config.createdBy }, (err, convo) => {
        if (err) {
          console.log(err)
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      })
    })
  }
})

controller.on('rtm_open', bot => console.log('** The RTM api just connected!'))

controller.on('rtm_close', bot => console.log('** The RTM api just closed!'))

controller.hears('!stop', 'direct_message', (bot, message) => {
  bot.reply(message, 'Bye.')
  bot.rtm.close()
})

// Launch bots in every invited team
controller.storage.teams.all((err, teams) => {
  if (err) throw new Error(err)
  teams.forEach(team => {
    if (team.bot) {
      controller.spawn(team).startRTM((err, bot) => err
        ? console.log('Error connecting bot to Slack:', err)
        : trackBot(bot))
    }
  })
})

app(controller)

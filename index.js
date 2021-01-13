const Discord = require('discord.js')
const fetch = require('node-fetch')
const moment = require('moment')
const { CronJob } = require('cron')
const { MongoClient } = require('mongodb')
const path = require('path')
const modules = require('require-all')(path.join(__dirname, 'modules'))
// eslint-disable-next-line no-unused-vars
const cron = require('cron').CronJob
const client = new Discord.Client()
const discordToken = process.env.DISCORD_BOT_TOKEN
const twitchClientId = process.env.TWITCH_CLIENT_ID
const twichClientSecret = process.env.TWITCH_CLIENT_SECRET
const mongoURL = process.env.MONGO_DB_URL
const simpChannelId = '690014059663458310'
const bobbyChannelId = '736706894667841626'

var bobbyChannel
var simpChannel
var cmdPrefix = '!'
var alertSent = false

// mongo
var pokiDb
const mognoClient = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

function registerCommands() {
  var modulesArray = Object.values(modules)
  var commands = []
  for (var ii = 0; ii < modulesArray.length; ii++) {
    commands.push(modulesArray[ii].info.command)
  }
  return commands
}

function calcBobbyTime() {
  const releaseDate = moment('2021.12.11', 'YYYY.MM.DD')
  const rn = moment()
  console.log(releaseDate.diff(rn, 'days'))
  return releaseDate.diff(rn, 'days')
}

async function getTwitchOauthToken() {
  const oauthUrl = `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twichClientSecret}&grant_type=client_credentials`

  var response = await fetch(oauthUrl, {
    method: 'POST'
  })

  var data = await response.json()
  console.log(data.access_token)
  return data.access_token
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log('started bobby cronjob')
  simpChannel = client.channels.cache.get(simpChannelId)
  bobbyChannel = client.channels.cache.get(bobbyChannelId)
  pokiDb = mognoClient.connect()
  console.log('db connected')
  const twitchToken = getTwitchOauthToken()
  console.log('got twitch token!')

  var freeBobbyMessage = new CronJob('0 0 * * *', function() {
    bobbyChannel.send(`Bobby will be free in ${calcBobbyTime()} days!`)
    console.log('fired bobby message')
  }, null, true)

  freeBobbyMessage.start()
  setInterval(function() {
    const pokiStreamUrl = 'https://api.twitch.tv/kraken/streams/44445592'
    fetch(pokiStreamUrl, {
      headers: {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-ID': twitchClientId,
        Authorization: `Bearer ${twitchToken}`
      },
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        if (data.stream == null) {
          client.user.setActivity('Not Pokimane', { type: 'WATCHING' })
          // send message if poki goes offline
          if (alertSent === true) {
            console.log('poki is offline')
            // simpChannel.send('Poki is now offline.')
          }
          alertSent = false
        } else {
          client.user.setActivity(`Pokimane play ${data.stream.game}`, { type: 'WATCHING' })
          if (alertSent === false) {
            var liveEmbed = new Discord.MessageEmbed()
            liveEmbed.setColor('#eb3327')
            liveEmbed.setTitle('Pokimane is Live on Twitch!')
            liveEmbed.setImage('https://i.imgur.com/Nqz0OJT.jpg')
            liveEmbed.setDescription(`Get your simp on!
${data.stream.channel.status}
https://twitch.tv/pokimane`)
            liveEmbed.setTimestamp()
            liveEmbed.setFooter('Poki I love you please let me suck your toes')
            // simpChannel.send(liveEmbed)
            // simpChannel.send('@here ^')
            console.log('poki is now online')
            alertSent = true
          }
        }
      })
  }, 5000)
})

// essentially bot commands
client.on('message', msg => {
  var msgArray = msg.content.split(' ')
  // bot should ignore itself!
  if (msg.author.id === '736317960691515412') {
    return
  }
  var ignored = ['283069267237142528']
  // first allocate money for pokipoints
  pokiDb.then(mango => {
    var pokiDollarDb = mango.db().collection('pokidollars')
    // update the db, making the user if thedy don't already exist!
    if (ignored.includes(msg.author.id)){
      return
    }
    pokiDollarDb.findOneAndUpdate(
      { discordId: msg.author.id },
      { $inc: { pokidollars: 1 } },
      { upsert: true }
    )
  })

  // ignore non commands
  if (msgArray[0].charAt(0) !== cmdPrefix) {
    return
  }
  var userCommand = msgArray.shift().replace(new RegExp(cmdPrefix, 'g'), '')
  // check to make sure message is a command
  if (!botCommands.includes(userCommand)) {
    return
  }
  // if we make it here we've got a command
  // pass in database if we need it
  if (modules[userCommand].info.database === true) {
    console.log(`${userCommand} wants the db`)
    modules[userCommand].main(msg, msgArray, pokiDb)
  } else {
    modules[userCommand].main(msg, msgArray)
  }
})

// register modules
var botCommands = registerCommands()

// start the bot
client.login(discordToken)

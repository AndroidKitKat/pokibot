require('dotenv').config()
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
var lastPokiMessage
var twitchToken

// mongo
var pokiDb
const mognoClient = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
var pokiLogDb
const mongoLogClient = new MongoClient(process.env.MONGO_LOG_URL, {
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
  // console.log(data.access_token)
  // return data.access_token
  console.log('got token from twitch')
  twitchToken = data.access_token
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log('started bobby cronjob')
  simpChannel = client.channels.cache.get(simpChannelId)
  bobbyChannel = client.channels.cache.get(bobbyChannelId)
  pokiDb = mognoClient.connect()
  console.log('db connected')
  pokiLogDb = mongoLogClient.connect()
  console.log('started loggin')
  getTwitchOauthToken()
  console.log('got twitch token!')

  var freeBobbyMessage = new CronJob('0 0 * * *', function() {
    bobbyChannel.send(`Bobby will be free in ${calcBobbyTime()} days!`)
    console.log('fired bobby message')
  }, null, true)

  // get new twitch token every 24 hours or so
  var getTTVToken = new CronJob('0 0 * * *', getTwitchOauthToken, null, true)

  freeBobbyMessage.start()
  getTTVToken.start()
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
  /*
  // log messages ( going to be needed for the delete command (i think)
  pokiLogDb.then(mango => {
    var serverIdchannelId = `${msg.guild.id}_${msg.channel.id}`
    var logDb = mango.db().collection(serverIdchannelId)
    logDb.insertOne(
      {
        id: msg.id,
        guildName: msg.guild.name,
        channelName: msg.channel.name,
        author: msg.author,
        content: msg.content
      }
    )
  })
  */
  // bot should ignore itself! (except for logging)
  if (msg.author.id === '736317960691515412') {
    // grab poki's last message
    lastPokiMessage = msg.author.lastMessage
    return
  }
  // IGNORED for pokidollars
  var ignored = ['283069267237142528'] // just matt
  // first allocate money for pokipoints

  // this is so it doesn't make a db connection everytime an ignore person talks
  if (!ignored.includes(msg.author.id)) {
    pokiDb.then(mango => {
      var pokiDollarDb = mango.db().collection('pokidollars')
      pokiDollarDb.findOneAndUpdate(
        { discordId: msg.author.id },
        { $inc: { pokidollars: 1 } },
        { upsert: true }
      )
    })
  }

  // ignore non commands
  if (msgArray[0].charAt(0) !== cmdPrefix) {
    return
  }
  // removes the prefix from the command, why did i do it this way?
  var userCommand = msgArray.shift().replace(new RegExp(cmdPrefix, 'g'), '')
  // check to make sure message is a command
  if (!botCommands.includes(userCommand)) {
    return
  }

  // if we make it here we've got a command
  // pass in database if we need it
  // start typing
  msg.channel.startTyping()
  if (modules[userCommand].info.database === true) {
    console.log(`${userCommand} wants the db`)
    modules[userCommand].main(msg, msgArray, pokiDb, pokiLogDb).then((res) => {
      res.forEach(response => {
        msg.channel.send(response)
      })
    }).catch(err => {
      err
    })
    msg.channel.stopTyping()
  } else {
    modules[userCommand].main(msg, msgArray, lastPokiMessage).then((res) => {
      res.forEach(response => {
        msg.channel.send(response)
      })
    }).catch(err => {
      err
    })
    msg.channel.stopTyping()
  }
})

// register modules
var botCommands = registerCommands()

// start the bot
client.login(discordToken)

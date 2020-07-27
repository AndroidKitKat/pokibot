const Discord = require('discord.js')
const moment = require('moment')
const fetch = require('node-fetch')
const responses = require("./botResponses.json")
const { CronJob } = require('cron')
const urlencode = require('urlencode')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const { MongoClient } = require('mongodb')
// eslint-disable-next-line no-unused-vars
const cron = require('cron').CronJob
const client = new Discord.Client()
const discordToken = process.env.DISCORD_BOT_TOKEN
const twitchToken = process.env.TWITCH_OAUTH_TOKEN
const mongoURI = process.env.MONGO_DB_URI
console.log(discordToken);
const simpChannelId = '690014059663458310'
const bobbyChannelId = '736706894667841626'

var bobbyChannel
var simpChannel
var cmdPrefix = '!p'
var alertSent = false

// mongo
var pokiDb
const mognoClient = new MongoClient(`mongodb://${mongoURI}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

function calcBobbyTime() {
  const releaseDate = moment('2020.12.11', 'YYYY.MM.DD')
  const rn = moment()
  return releaseDate.diff(rn, 'days')
}

function calcRowdyTime() {
  const rReleaseDate = moment('2020.12.15', 'YYYY.MM.DD')
  const rn = moment()
  return rReleaseDate.diff(rn, 'days')
}

// Helper function which creates an embedded message from Json data
function createJsonEmbed(embedType) {
  emData = responses.embeded[embedType];
  const newEmbed = new Discord.MessageEmbed()
  if (!emData) {
    newEmbed.setDescription("Embedding failed :(");
  }
  else {
    newEmbed.setTitle(emData.title);
    newEmbed.setDescription(emData.message);
    newEmbed.setColor(emData.color);
    newEmbed.setImage(emData.image);
  }
  return newEmbed
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log('started bobby cronjob')
  simpChannel = client.channels.cache.get(simpChannelId)
  bobbyChannel = client.channels.cache.get(bobbyChannelId)
  pokiDb = mognoClient.connect();
  console.log('db connected');

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
        'Client-ID': 'zfwmhzfmpxrhdoufl2cwf7z2iqlk6l',
        Authorization: `Bearer ${twitchToken}`
      },
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        if (data.stream == null) {
          client.user.setActivity('Not Pokimane', { type: 'WATCHING' })
          alertSent = false
        } else {
          client.user.setActivity('Pokimane', { type: 'WATCHING' })
          if (alertSent === false) {
            var liveEmbed = new Discord.MessageEmbed()
            liveEmbed.setColor('#eb3327')
            liveEmbed.setTitle('@here, Pokimane is Live on Twitch!')
            liveEmbed.setImage(data.stream.preview.large)
            liveEmbed.setDescription(`Get your simp on!
${data.stream.channel.status}
https://twitch.tv/pokimane`)
            simpChannel.send(liveEmbed)
            console.log('poki is now online')
            alertSent = true
          }
        }
      })
  }, 5000)
})

function dpSearch(type, query) {
  var baseSearchUrl = 'https://www.dogpile.com/search/'
  if (type === 'web') {
    baseSearchUrl = baseSearchUrl + 'web?q='
  } else if (type === 'image') {
    baseSearchUrl = baseSearchUrl + 'images?q='
  }
  const searchQuery = urlencode(query)
  const searchUrl = baseSearchUrl + searchQuery

  // now we have to make the request and parse the html
  if (type === 'image') {
    return fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
      }
    }).then((res) => {
      return res.text()
    }).then((data) => {
      const dom = new JSDOM(data)
      var results = dom.window.document.getElementsByClassName('link')
      if (results.length === 0) {
        return 'No results.'
      } else {
        return results[Math.floor(Math.random() * results.length)].href
      }
    })
  } else {
    return fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
      }
    }).then((res) => {
      return res.text()
    }).then((data) => {
      const dom = new JSDOM(data)
      var results = dom.window.document.getElementsByClassName('web-bing__url')
      if (results.length === 0) {
        return 'No results.'
      } else {
        return results[Math.floor(Math.random() * results.length)].innerHTML
      }
    })
  }
}

// essentially bot commands
client.on('message', msg => {
  // bot should ignore itself!
  if (msg.author.id === '736317960691515412') {
    return
  }
  // increment the pokidollars
  pokiDb.then(mango => {
    var pokiDollarDb = mango.db().collection('pokidollars')
    // update the db, making the user if they don't already exist!
    pokiDollarDb.findOneAndUpdate(
      { discordId: msg.author.id },
      { $inc: { pokidollars: 1 } },
      { upsert: true }
    )
  })

  var msgArray = msg.content.split(' ')
  var prefix = ''
  var command = ''

  // Get the prefix and the command
  if (msgArray.length >= 2) {
    prefix = msgArray.shift()
    command = msgArray.shift()
  }

  // help
  if (msgArray.join(' ') === '!help') {
    msg.author.send(responses.help)
  }

  // dogpile search
  if (prefix === '!g') {
    const duckQuery = command + ' ' + msgArray.join(' ')
    dpSearch('web', duckQuery).then((searchResult) => {
      msg.channel.send(searchResult)
    })
  }
  // dogpile image search
  if (prefix === '!gis') {
    const imageQuery = command + ' ' + msgArray.join(' ')
    dpSearch('image', imageQuery).then((searchResult) => {
      msg.channel.send(searchResult)
    })
  }

  // reddit stuff
  if (prefix === '!r') {
    const subreddit = command
    // make sure the user doesn't do anything stupid
    if (msgArray.length > 0) {
      msg.channel.send(responses.reddit.invalidArgs1)
      return
    } else if (subreddit.length > 21) {
      msg.channel.send(responses.reddit.invalidArgs2)
      return
    }
    var redditUrl = 'https://reddit.com/r/' + subreddit + '/.json'
    fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.data.children.length === 0) {
        msg.channel.send(responses.reddit.noSubreddit)
      }
      var postList = data.data.children
      var redditEmbed = new Discord.MessageEmbed()
      var post = postList[Math.floor(Math.random() * postList.length)]
      redditEmbed.setURL(post.data.url)
      redditEmbed.setTitle(post.data.title)
      // trim selftext to be less than 1024 chars
      redditEmbed.setDescription(post.data.selftext.substr(0, 1024))
      redditEmbed.setColor('#B7E7A8')
      if (post.data.thumbnail !== 'self') {
        redditEmbed.setImage(post.data.thumbnail)
      }
      msg.channel.send(redditEmbed)
    })
  }
  // free bobby!
  if (prefix === '!free') {
    if (command === 'bobby') {
      msg.channel.send(createJsonEmbed("free bobby"));
      // Calculate time till bobby is free
      msg.channel.send(`Bobby will be free in ${calcBobbyTime()} days!`)
    } else if (command === 'rowdy') {
      msg.channel.send(`Rowdy will be free in ${calcRowdyTime()} days!`)
    }
  }
  // homo simpians
  if (prefix === '!simp') {
    if (command === 'alert') {
      msg.channel.send(createJsonEmbed("simp alert"));
    }
  }

  if (prefix === cmdPrefix) { // Only look at messages with the correct command prefix
    if (command === 'hello') {
      msg.channel.send('hello')
    } else if (command === 'say') {
      if (msgArray.length >= 1) {
        msg.channel.send(msgArray.join(' '))
      } else {
        msg.channel.send('Hey you messed up, hehe. Give me something to say, !p say <message>')
      }
    } else if (command === 'sub') {
      // check for the sub tiers
      if (msgArray.join(' ').toLowerCase() === 'tier 3') {
        const t3embed = new Discord.MessageEmbed()
        t3embed.setTitle('Thanks for the Sub ^_^')
        t3embed.setColor('#b970df')
        t3embed.setDescription(`I reaaallllyyy appreciate the sub <@${msg.author.id}>.`)
        t3embed.setImage('https://media.tenor.com/images/0de2b320fc290bd68a63f55431f9bf4f/tenor.gif')
        msg.channel.send(t3embed)
        msg.channel.send(createJsonEmbed("tier 3"))
      } else if (msgArray.join(' ').toLowerCase() === 'tier 2') {
        msg.channel.send(createJsonEmbed("tier 2"));
      } else if (msgArray.join(' ').toLowerCase() === 'tier 1') {
        msg.channel.send(createJsonEmbed("tier 1"));
      }
    } else if (command === 'pokigasm') {
      var gasmEmbed = new Discord.MessageEmbed()
      gasmEmbed.setColor('#b970df')
      gasmEmbed.setImage('https://thumbs.gfycat.com/DimFancyFairyfly-size_restricted.gif')
      gasmEmbed.setTitle('Pokigasm')
      gasmEmbed.setDescription(`Oh yes <@${msg.author.id}>`)
      msg.channel.send(gasmEmbed)
    } else if (command === 'send') {
      if (msgArray.join(' ') === 'feet pics maybe?') {
        // Add method to pirchase feet pics
        msg.channel.send(createJsonEmbed("feet pics"));
      }
    } else if (command === 'donated') {
      // check how much a user has donated
      // see if user was supplied (msgArray will contain a nick)
      var donoResponses = responses.donated;
      var targetId = ''
      if (msgArray.length > 1) {
        msg.channel.send(donoResponses.invalidArgs)
        return
      } else if (msgArray.length === 0) {
        targetId = msg.author.id
      } else {
        targetId = msgArray[0].replace(/\D/g, '')
      }
      // query the db 
      pokiDb.then(mango => {
        var pokiDollarDb = mango.db().collection('pokidollars')
        // update the db, making the user if they don't already exist!
        pokiDollarDb.findOne(
          { discordId: targetId }
        ).then((userInfo, err) => {
          if (err) {
            msg.channel.send(donoResponses.userError)
            return
          }
          if (userInfo === null) {
            msg.channel.send(donoResponses.userError)
            return
          }
          msg.channel.send(`<@!${targetId}> has $${userInfo.pokidollars}${responses.donatePhrases[Math.floor(Math.random() * responses.donatePhrases.length)]}`)
        })
      })
    } else { // Otherwise select an invalid command
        msg.channel.send(responses.invalidCommand[Math.floor(Math.random() * responses.invalidCommand.length)]);
    } 
  }
})

// start the bot
client.login(discordToken)

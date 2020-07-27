const Discord = require('discord.js')
const moment = require('moment')
const fetch = require('node-fetch')
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

var bobbyChannel
var simpChannel
var cmdPrefix = '!p'
var alertSent = false

// mongo
const mognoClient = new MongoClient(`mongodb://${mongoURI}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const pokiDb = 'pokidb'

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

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log('started bobby cronjob')
  simpChannel = client.channels.cache.get('690014059663458310')
  bobbyChannel = client.channels.cache.get('736706894667841626')

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

  mognoClient.connect().then(mango => {
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
    msg.author.send('read the code: https://github.com/AndroidKitKat/pokibot')
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
      msg.channel.send('Hey, sooo you can\'t have a sub name longer than one word. Try again ^.^')
      return
    } else if (subreddit.length > 21) {
      msg.channel.send('Hey, soooo subreddit names can\'t be that long. Try again :pokishy:')
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
      var bobbyEmbed = new Discord.MessageEmbed()
      bobbyEmbed.setColor('#eb3327')
      bobbyEmbed.setTitle('Pokimane?')
      bobbyEmbed.setDescription('Nah, pokemon')
      bobbyEmbed.setImage('https://www.mypokecard.com/en/Gallery/my/galery/AUFz107M7SKK.jpg')
      msg.channel.send(bobbyEmbed)
      // Calculate time till bobby is free
      msg.channel.send(`Bobby will be free in ${calcBobbyTime()} days!`)
    } else if (command === 'rowdy') {
      msg.channel.send(`Rowdy will be free in ${calcRowdyTime()} days!`)
    }
  }
  // homo simpians
  if (prefix === '!simp') {
    if (command === 'alert') {
      var simpEmbed = new Discord.MessageEmbed()
      simpEmbed.setColor('#b970df')
      simpEmbed.setTitle('Hey man')
      simpEmbed.setDescription('We only simp ironically here')
      simpEmbed.setImage('https://dxt.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMjBcXFwvMDZcXFwvMzAyMTQ1MTlcXFwvcG9raW1hbmVjb21tZW50c2ltcGFubm95aW5nLmdpZlwiLFwid2lkdGhcIjo2MjAsXCJoZWlnaHRcIjozNDcsXCJkZWZhdWx0XCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMTlcXFwvMTFcXFwvMTEyMTQ5NDNcXFwvcGxhY2Vob2xkZXIuanBnXCIsXCJvcHRpb25zXCI6e1wib3V0cHV0XCI6XCJ3ZWJwXCJ9fSIsImhhc2giOiJmNjk1Y2Y2MGZkOGQ2MjdiYTBlNGE5NTU5YWE2ZWIwYThlZGE4MzdlIn0=/pokimane-reveals-how-she-deals-with-annoying-online-simp-comments.gif')
      msg.channel.send(simpEmbed)
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
      } else if (msgArray.join(' ').toLowerCase() === 'tier 2') {
        const t2embed = new Discord.MessageEmbed()
        t2embed.setTitle('Thanks for the sub')
        t2embed.setColor('#b970df')
        t2embed.setDescription('Thanks, but it won\'t buy me a new computer')
        t2embed.setImage('https://thumbs.gfycat.com/BlissfulBriefAngwantibo-max-1mb.gif')
        msg.channel.send(t2embed)
      } else if (msgArray.join(' ').toLowerCase() === 'tier 1') {
        const t1embed = new Discord.MessageEmbed()
        t1embed.setTitle('...')
        t1embed.setColor('#b970df')
        t1embed.setDescription('Thanks, I guess...')
        t1embed.setImage('https://www.talkesport.com/wp-content/uploads/tenor-1.gif')
        msg.channel.send(t1embed)
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
        var feetEmbed = new Discord.MessageEmbed()
        feetEmbed.setColor('#b970df')
        feetEmbed.setTitle('Well...')
        feetEmbed.setDescription('You did donate soooo....')
        feetEmbed.setImage('https://i.redd.it/skd0krqm35x31.gif')
        msg.channel.send(feetEmbed)
      }
    } else if (command === 'donated') {
      // check how much a user has donated
      mognoClient.connect().then(mango => {
        var pokiDollarDb = mango.db().collection('pokidollars')
        // update the db, making the user if they don't already exist!
        pokiDollarDb.findOne(
          { discordId: msg.author.id }
        ).then((userInfo) => {
          msg.reply(` you have $${userInfo.pokidollars}`)
        })
      })
    }
  }
})

// start the bot
client.login(discordToken)

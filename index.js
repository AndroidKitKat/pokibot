const Discord = require('discord.js');
const client = new Discord.Client();
const bobbyTime = new Schedule(sendBobbyMessage)
const fetch = require('node-fetch')
const Schedule = require('schedule-js')

const discordToken = process.env.DISCORD_BOT_TOKEN
const twitchToken = process.env.TWITCH_OAUTH_TOKEN

var bobbyChannel = null
var simpChannel = null
var cmdPrefix = "!p";
var alertSent = false

function sendBobbyMessage() {
  bobbyChannel.send(`Bobby will be free in ${calcBobbyTime()} days!`)
}

// announce how many days bobby has left at midnight (free bobby btw)
bobbyTime.scheduleAt('1d', '00:00')

function calcBobbyTime() {
  // how much is one day?
  const oneDay = 24 * 60 * 60 * 1000
  // bobby is free on this day
  const releaseDate = new Date(2020, 11, 11)
  // what is the current date?
  const today = new Date()
  const timeLeft = Math.round(Math.abs((releaseDate - today) / oneDay))
  return timeLeft
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  simpChannel = client.channels.cache.get('690014059663458310')
  bobbyChannel = client.channels.cache.get('736706894667841626')
  setInterval(function() {
    pokiStreamUrl = 'https://api.twitch.tv/kraken/streams/44445592'
    fetch(pokiStreamUrl, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'zfwmhzfmpxrhdoufl2cwf7z2iqlk6l',
            'Authorization': `Bearer ${twitchToken}`,
        },
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.stream == null) {
          client.user.setActivity('Not Pokimane', { type: 'WATCHING' });
          alertSent = false          
        } else {
          client.user.setActivity('Pokimane', { type: 'WATCHING' });
          if (alertSent == false) {
            liveEmbed = new Discord.MessageEmbed()
            liveEmbed.setColor('#eb3327')
            liveEmbed.setTitle('@here, Pokimane is Live on Twitch!')
            liveEmbed.setImage(data.stream.preview.large)
            liveEmbed.setDescription(`Get your simp on!
${data.stream.channel.status}
https://twitch.tv/pokimane`)
            simpChannel.send(liveEmbed)
            alertSent = true
          }
        }
    })
  }, 5000);
});

client.on('message', msg => {
  // Simple say command
  var msgArray = msg.content.split(" ");
  var prefix = "";
  var command = "";

  // Get the prefix and the command
  if (msgArray.length >= 2) {
    prefix = msgArray.shift();
    command = msgArray.shift();
  }

  // help
  if (msgArray.join(' ') === '!help') {
    msg.author.send('read the code: https://github.com/AndroidKitKat/pokibot')

  }
  // free bobby!
  if (prefix === '!free') {
   if (command === 'bobby') {
     bobbyEmbed = new Discord.MessageEmbed()
     bobbyEmbed.setColor('#eb3327')
     bobbyEmbed.setTitle('Pokimane?')
     bobbyEmbed.setDescription('Nah, pokemon')
     bobbyEmbed.setImage('https://www.mypokecard.com/en/Gallery/my/galery/AUFz107M7SKK.jpg')
     msg.channel.send(bobbyEmbed)
     // Calculate time till bobby is free
     msg.channel.send(`Bobby will be free in ${calcBobbyTime()} days!`)
   }
  }
  // homo simpians
  if (prefix === '!simp') {
    if (command === 'alert') {
      simpEmbed = new Discord.MessageEmbed()
      simpEmbed.setColor('#b970df')
      simpEmbed.setTitle('Hey man')
      simpEmbed.setDescription('We only simp ironically here')
      simpEmbed.setImage('https://dxt.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMjBcXFwvMDZcXFwvMzAyMTQ1MTlcXFwvcG9raW1hbmVjb21tZW50c2ltcGFubm95aW5nLmdpZlwiLFwid2lkdGhcIjo2MjAsXCJoZWlnaHRcIjozNDcsXCJkZWZhdWx0XCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMTlcXFwvMTFcXFwvMTEyMTQ5NDNcXFwvcGxhY2Vob2xkZXIuanBnXCIsXCJvcHRpb25zXCI6e1wib3V0cHV0XCI6XCJ3ZWJwXCJ9fSIsImhhc2giOiJmNjk1Y2Y2MGZkOGQ2MjdiYTBlNGE5NTU5YWE2ZWIwYThlZGE4MzdlIn0=/pokimane-reveals-how-she-deals-with-annoying-online-simp-comments.gif')
      msg.channel.send(simpEmbed)
    }
  }

  if (prefix === cmdPrefix) { // Only look at messages with the correct command prefix
    if (command === "hello") {
      msg.channel.send("hello");
    }
    else if (command === "say") {
      if (msgArray.length >= 1) {
        msg.channel.send(msgArray.join(" "));
      }
      else {
        msg.channel.send("Hey you fucked up, give me something to say, !p say <message>");
      }
    } else if (command === "sub") {
      // check for the sub tiers
      if (msgArray.join(" ").toLowerCase() === 'tier 3') {
        const t3embed = new Discord.MessageEmbed()
        console.log(msg)
        t3embed.setTitle('Thanks for the Sub ^_^')
        t3embed.setColor('#b970df')
        t3embed.setDescription(`I reaaallllyyy appreciate the sub <@${msg.author.id}>.`)
        t3embed.setImage('https://media.tenor.com/images/0de2b320fc290bd68a63f55431f9bf4f/tenor.gif')
        msg.channel.send(t3embed)
      } else if (msgArray.join(" ").toLowerCase() === 'tier 2') {
        const t2embed = new Discord.MessageEmbed()
        t2embed.setTitle('Thanks for the sub')
        t2embed.setColor('#b970df')
        t2embed.setDescription(`Thanks, but it won't buy me a new computer`)
        t2embed.setImage('https://thumbs.gfycat.com/BlissfulBriefAngwantibo-max-1mb.gif')
        msg.channel.send(t2embed)
      } else if (msgArray.join(" ").toLowerCase() === 'tier 1') {
        const t1embed = new Discord.MessageEmbed()
        t1embed.setTitle('...')
        t1embed.setColor('#b970df')
        t1embed.setDescription(`Thanks, I guess...`)
        t1embed.setImage('https://www.talkesport.com/wp-content/uploads/tenor-1.gif')
        msg.channel.send(t1embed)
      }
    } else if (command === "pokigasm") {
      gasmEmbed = new Discord.MessageEmbed()
      gasmEmbed.setColor('#b970df')
      gasmEmbed.setImage('https://thumbs.gfycat.com/DimFancyFairyfly-size_restricted.gif')
      gasmEmbed.setTitle('Pokigasm')
      gasmEmbed.setDescription(`Oh yes <@${msg.author.id}>`)
      msg.channel.send(gasmEmbed)
    } else if (command === 'send') {
      if (msgArray.join(' ') === 'feet pics maybe?') {
        feetEmbed = new Discord.MessageEmbed()
        feetEmbed.setColor('#b970df')
        feetEmbed.setTitle('Well...')
        feetEmbed.setDescription('You did donate soooo....')
        feetEmbed.setImage('https://i.redd.it/skd0krqm35x31.gif')
        msg.channel.send(feetEmbed)
      }
    }
  }
});



client.login(discordToken);

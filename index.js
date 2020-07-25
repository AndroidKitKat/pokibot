const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch')

const discordToken = process.env.DISCORD_BOT_TOKEN
const twitchToken = process.env.TWITCH_OAUTH_TOKEN

var cmdPrefix = "!p";
var alertSent = false

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var simpChannel = client.channels.cache.get('690014059663458310')
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
            simpChannel.send(`@here Poki is online!
${data.stream.channel.game}
https://twitch.tv/pokimane`)
            alertSent = true
          }
        }
    })
  }, 5000)
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

  if (prefix === cmdPrefix) { // Only look at messages with the correct command prefix
    if (command === "hello") {
      msg.channel.send("hello");
    }
  }
});



client.login(discordToken);

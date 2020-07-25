const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch')

client.on('ready', () => {
  const discordToken = process.env.DISCORD_BOT_TOKEN
  const twitchToken = process.env.TWITCH_OAUTH_TOKEN
  console.log(`Logged in as ${client.user.tag}!`);
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
        } else {
          client.user.setActivity('Pokimane', { type: 'WATCHING' });
        }
    })
  }, 5000)
});

client.on('message', msg => {
  console.log(msg)
});

client.login(discordToken);

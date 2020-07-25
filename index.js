const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(function() {
    pokiStreamUrl = 'https://api.twitch.tv/kraken/streams/44445592'
    fetch(pokiStreamUrl, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'zfwmhzfmpxrhdoufl2cwf7z2iqlk6l',
            'Authorization': 'Bearer e0pe2ag5egmts419ctm3pt72kmtpwl',
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

client.login('NzM2MzE3OTYwNjkxNTE1NDEy.XxtDiQ.uAMot03avcIN8bRQXNA_CIqsOfM');

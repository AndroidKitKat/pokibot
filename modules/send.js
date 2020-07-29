const Discord = require('discord.js')

module.exports = {
  info: {
    name: 'send',
    desc: 'can send a few different things to the channel, namely feet pics',
    database: false,
    command: 'send',
    example: `!send feet pics maybe?
  > feeet`
  },
  // function MUST be called main
  main: function(msgData, msgArray) {
    if (msgArray.join(' ') === 'feet pics maybe?') {
      msgData.channel.send(new Discord.MessageEmbed()
        .setTitle('Well...')
        .setDescription('You did donate soooo....')
        .setImage('https://i.redd.it/skd0krqm35x31.gif')
        .setColor('#b970df'))
    }
  }
}

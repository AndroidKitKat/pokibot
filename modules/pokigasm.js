const Discord = require('discord.js')

module.exports = {
  info: {
    name: 'Pokigasm',
    desc: 'Sends a fat pokigasm to the channel',
    database: false,
    command: 'pokigasm',
    example: `!pokigasm
  > oh lordy a pokigasm`
  },
  // function MUST be called main
  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {
      resolve(new Discord.MessageEmbed().setTitle('Pokigasm')
        .setDescription(`Oh yes <@${msgData.author.id}>`)
        .setImage('https://thumbs.gfycat.com/DimFancyFairyfly-size_restricted.gif')
        .setColor('#b970df'))
    })
  }
}

const Discord = require('discord.js')

module.exports = {
  info: {
    name: 'Simp Alert',
    desc: 'Stop being such a simp lmao',
    database: false,
    command: 'simp',
    example: `!simp alert
  > You're such a simp`
  },
  // function MUST be called main
  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {
      if (msgArray.shift() === 'alert') {
        resolve([new Discord.MessageEmbed()
          .setTitle('Hey man')
          .setDescription('We only simp ironically here.')
          .setImage('https://i.imgur.com/dPyh4HO.gif')
          .setColor('#eb3327')])
      }
    })
  }
}

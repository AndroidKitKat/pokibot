const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
  info: {
    name: 'Example',
    desc: 'Free innocent people',
    command: 'free',
    example: `!free bobby
> Bobby will be free in 69 days`
  },
  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {
      var name = msgArray.shift()
      if (name === undefined) {
        reject('no name given')
      }
      if (name.toLowerCase() === 'bobby') {
        resolve([
          new Discord.MessageEmbed().setImage('https://i.imgur.com/wQN1eju.jpg').setColor('#eb3327').setTitle('Pokimane?').setDescription('Nah, pokemon'),
          `Bobby will be free in ${calcTime('2021.12.11')} days!`,
        ])
      } else if (name.toLowerCase() === 'rowdy') {
        resolve([`Rowdy will be free in ${calcTime('2020.12.15')} days!`])
      } else {
        resolve(['They ain\'t in jail hun'])
      }
    })
  }
}

// if you want to use a function in your module, just write one and then call it in your main function!
function calcTime(date) {
  return moment(date, 'YYYY.MM.DD').diff(moment(), 'days')
}

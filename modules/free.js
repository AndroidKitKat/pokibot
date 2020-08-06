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
    var name = msgArray.shift()
    if (name === undefined) {
      return
    }
    if (name.toLowerCase() === 'bobby') {
      msgData.channel.send(new Discord.MessageEmbed()
        .setImage('https://www.mypokecard.com/en/Gallery/my/galery/AUFz107M7SKK.jpg')
        .setColor('#eb3327')
        .setTitle('Pokimane?')
        .setDescription('Nah, pokemon'))
      msgData.channel.send(`Bobby will be free in ${calcTime('2020.12.11')} days!`)
    } else if (name.toLowerCase() === 'rowdy') {
      msgData.channel.send(`Rowdy will be free in ${calcTime('2020.12.15')} days!`)
    } else {
      msgData.channel.send('They must be free.')
    }
  }
}

// if you want to use a function in your module, just write one and then call it in your main function!
function calcTime(date) {
  return moment(date, 'YYYY.MM.DD').diff(moment(), 'days')
}

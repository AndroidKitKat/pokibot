const Discord = require('discord.js')

module.exports = {
  info: {
    name: 'Sub',
    desc: 'Stop being such a simp lmao',
    database: false,
    command: 'sub',
    example: `!sub tier 3
  > Tier 3 subs to pokimane`
  },
  // function MUST be called main
  main: function(msgData, msgArray) {
    if (msgArray.shift() === 'tier') {
      var title; var desc; var image
      switch (msgArray.shift()) {
        case '1':
          title = '...'
          desc = 'Thanks, I guess...'
          image = 'https://www.talkesport.com/wp-content/uploads/tenor-1.gif'
          break
        case '2':
          title = 'Thanks for the sub'
          desc = 'Thanks, but it won\'t buy me a new computer'
          image = 'https://thumbs.gfycat.com/BlissfulBriefAngwantibo-max-1mb.gif'
          break
        case '3':
          title = 'Thanks for the Sub ^_^'
          desc = `I reaaallllyyy appreciate the sub <@${msgData.author.id}>.`
          image = 'https://media.tenor.com/images/0de2b320fc290bd68a63f55431f9bf4f/tenor.gif'
          break
        default:
          return
      }
      msgData.channel.send(new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setImage(image)
        .setColor('#b970df'))
    }
  }
}

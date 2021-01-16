const { Message, DiscordAPIError } = require("discord.js")

module.exports = {
  info: {
    name: 'Delte',
    desc: 'This gives you the ability to delete the last message from the bot',
    // todo add ability to restrict to people i trust
    database: false,
    command: 'delte',
    example: `!delte this
> *deletes the last message the bot sent*`
  },
  main: function(msgData, msgArray, lastPokiMessage) {
    return new Promise((resolve, reject) => {
      lastPokiMessage.edit('delted message. im sowwy (⋟﹏⋞)').then(console.log(`a poki message was deleted by ${msgData.author.username}`))
      reject('No Message')
    })
  }
}

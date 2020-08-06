module.exports = {
  info: {
    name: 'Say',
    desc: 'This is the say command',
    database: false,
    command: 'say',
    example: `!say Hi pokibot!
> Hi pokibot!`
  },
  main: function(msgData, msgArray) {
    if (msgArray.join(' ') === '' ) {
      msgData.channel.send('You need to tell me to say something.')
      return
    }
    msgData.channel.send(msgArray.join(' '))
  }
}

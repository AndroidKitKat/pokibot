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
    msgData.channel.send(msgArray.join(' '))
  }
}

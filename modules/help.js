module.exports = {
  info: {
    name: 'Help',
    desc: 'Help module.',
    command: 'help',
    example: `!help
  > Tells you to read the code`
  },

  main: function(msgData, msgArray) {
    msgData.author.send('read the code: https://github.com/AndroidKitKat/pokibot')
  }
}

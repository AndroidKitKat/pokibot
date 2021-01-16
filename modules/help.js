module.exports = {
  info: {
    name: 'Help',
    desc: 'Help module.',
    database: false,
    command: 'help',
    example: `!help
  > Tells you to read the code`
  },

  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {
      resolve(['read the code: https://github.com/AndroidKitKat/pokibot'])
    })
  }
}

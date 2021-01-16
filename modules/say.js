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
    return new Promise((resolve, reject) => {
      if (msgArray.join(' ') === '' ) {
        resolve('You need to tell me to say something.')
      }
      resolve(msgArray.join(' '))
    })
  }
}

module.exports = {
  info: {
    name: 'donated',
    desc: 'Shows how many pokidollars a user has donated',
    // if your function needs access to the database, make sure to set this to true
    database: true,
    command: 'donated',
    example: `!donated
  > <!@$USER> has donated X pokidollars`
  },
  // pass in the message object, the message array. if you have database: true, make sure to pass in the db
  // function MUST be called main
  main: function(msgData, msgArray, dbObject) {
    var targetId = ''
    if (msgArray.length > 1) {
      msgData.channel.send(phrases.invalidArgs)
      return
    } else if (msgArray.length === 0) {
      targetId = msgData.author.id
    } else {
      targetId = msgArray[0].replace(/\D/g, '')
    }
    dbObject.then(mango => {
      var pokiDollarDb = mango.db().collection('pokidollars')
      pokiDollarDb.findOne(
        { discordId: targetId }
      ).then((userInfo, err) => {
        if (err) {
          msgData.channel.send(phrases.userError)
          return
        }
        if (userInfo === null) {
          msgData.send(phrases.userError)
          return
        }
        msgData.channel.send(`<@!${targetId}> has $${userInfo.pokidollars}${phrases.donatePhrases[Math.floor(Math.random() * phrases.donatePhrases.length)]}`)
      })
    })
  }
}

var phrases = {
  invalidArgs: "Silly, you can't provide more than one nick *nuzzles you*",
  userError: "Hmmmm, I don't remember them donating anything. Maybe I didn't see it on my screen? Tee hee.",
  donatePhrases: [
    ', but feel free to donate more :)',
    '. Keep trying to donate more! Every bit helps! <3',
    ' and I realllllly appreciate it.',
    ", but it's not about the money, I just enjoy chatting with you :kissing_heart:",
  ]
}

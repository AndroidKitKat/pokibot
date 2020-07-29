module.exports = {
  info: {
    name: 'quote',
    desc: 'Keeps track of user quotes and whatnot.',
    database: true,
    command: 'quote',
    example: `!quote @AndroidKitKat
  > [1/2] @AndroidKitKat: Hi!`
  },
  main: function(msgData, msgArray, dbObject) {
    // do we want to add a quote?
    var type = msgArray.shift()
    // we want to add a quote
    if (type === undefined) {
      msgData.channel.send('You didn\'t supply a username!')
      return
    }
    if (type.toLowerCase() === 'add') {
      var userId = msgArray.shift()
      var newQuote = msgArray.join(' ')

      if (!(/<@!\d.*>/.test(userId))) {
        msgData.channel.send('Not a valid user!')
        return
      }
      if (newQuote === '') {
        msgData.channel.send('Quote cannot be empty!')
        return
      }
      dbObject.then(mango => {
        var pokiQuoteDb = mango.db().collection('quotes')
        pokiQuoteDb.findOneAndUpdate(
          {discordId: userId.replace(/\D/g, '') },
          { $push: { quotes: newQuote } },
          { upsert: true }
        )
        msgData.channel.send('The operation completed.')
      })
    } else if (/@!\d*>/.test(type)) {
      // user type
      var searchId = type.replace(/\D/g, '')
      var quoteNum = msgArray[0]
      // check if anything was given
      if (quoteNum !== undefined) {
        // check to make sure it's a number
        if (isNaN(quoteNum)) {
          msgData.channel.send(`${quoteNum} is not a valid number!`)
          return
        }
      }
      dbObject.then(mango => {
        var pokiQuoteDb = mango.db().collection('quotes')
        pokiQuoteDb.findOne(
          { discordId: searchId }
        ).then((userInfo, err) => {
          if (err) {
            msgData.channel.send('Seems there was error contacting the database.')
            return
          }
          if (userInfo === null) {
            msgData.channel.send(`<@!${searchId}> doesn't have any quotes. :/`)
            return
          }
          if (quoteNum === undefined) {
            var max = userInfo.quotes.length
            var min = 1
            quoteNum = Math.floor(Math.random() * (max - min + 1)) + min
          }
          var quote = userInfo.quotes[+quoteNum - 1]
          // make sure the quote isn't undefined
          if (quote === undefined) {
            msgData.channel.send(`That doesn't appear to be a valid quote number. I have ${userInfo.quotes.length} quotes for that user.`)
            return
          }
          msgData.channel.send(`[${+quoteNum}/${userInfo.quotes.length}] <@!${searchId}>: ${quote}`)
        })
      })
    }
  }
}

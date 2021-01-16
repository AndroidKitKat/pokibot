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
    return new Promise((resolve, reject) => {
      // do we want to add a quote?
      var type = msgArray.shift()
      // we want to add a quote
      if (type === undefined) {
        resolve(['You didn\'t supply a username!'])
      }
      if (type.toLowerCase() === 'add') {
        var userId = msgArray.shift()
        var newQuote = msgArray.join(' ')

        if (!(/<@!\d.*>/.test(userId))) {
          resolve(['Not a valid user!'])
        }
        if (newQuote === '') {
          resolve(['Quote cannot be empty!'])
        }
        dbObject.then(mango => {
          var pokiQuoteDb = mango.db().collection('quotes')
          pokiQuoteDb.findOneAndUpdate(
            { discordId: userId.replace(/\D/g, '') },
            { $push: { quotes: newQuote } },
            { upsert: true }
          )
          resolve(['The operation completed.'])
        })
      } else if (/@!\d*>/.test(type)) {
        // user type
        var searchId = type.replace(/\D/g, '')
        var quoteNum = msgArray[0]
        // check if anything was given
        if (quoteNum !== undefined) {
          // check to make sure it's a number
          if (isNaN(quoteNum)) {
            resolve([`${quoteNum} is not a valid number!`])
          }
        }
        dbObject.then(mango => {
          var pokiQuoteDb = mango.db().collection('quotes')
          pokiQuoteDb.findOne(
            { discordId: searchId }
          ).then((userInfo, err) => {
            if (err) {
              resolve(['Seems there was error contacting the database.'])
            }
            if (userInfo === null) {
              resolve([`<@!${searchId}> doesn't have any quotes. :/`])
            }
            if (quoteNum === undefined) {
              var max = userInfo.quotes.length
              var min = 1
              quoteNum = Math.floor(Math.random() * (max - min + 1)) + min
            }
            var quote = userInfo.quotes[+quoteNum - 1]
            // make sure the quote isn't undefined
            if (quote === undefined) {
              resolve([`That doesn't appear to be a valid quote number. I have ${userInfo.quotes.length} quotes for that user.`])
            }
            resolve([`[${+quoteNum}/${userInfo.quotes.length}] <@!${searchId}>: ${quote}`])
          })
        })
      }
    })
  }
}

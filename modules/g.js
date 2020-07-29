const urlencode = require('urlencode')
const { default: fetch } = require('node-fetch')
const { JSDOM } = require('jsdom')

module.exports = {
  info: {
    name: 'Technically dogpile search',
    desc: 'This module searches DogPile for content',
    // if your function needs access to the database, make sure to set this to true
    database: false,
    command: 'g',
    example: `!g horses
  > URL of some horses idk`
  },

  main: function(msgData, msgArray) {
    dpSearch(msgArray.join(' ')).then(res => {
      msgData.channel.send(res)
    })
  }
}

function dpSearch(query) {
  var url = 'https://www.dogpile.com/search/web?q=' + urlencode(query)
  return fetch(url, {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
  }).then(res => {
    return res.text()
  }).then(data => {
    const dom = new JSDOM(data)
    var results = dom.window.document.getElementsByClassName('web-bing__url')
    if (results.length === 0) {
      return 'No results'
    } else {
      return results[Math.floor(Math.random() * results.length)].innerHTML
    }
  })
}

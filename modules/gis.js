const fetch = require('node-fetch')
const urlencode = require('urlencode')

module.exports = {
  info: {
    name: 'Technically DogPile Image Search ',
    desc: 'This module searches DogPile for content',
    // if your function needs access to the database, make sure to set this to true
    database: false,
    command: 'gis',
    example: `!gis horses
  > picture of some horses idk`
  },

  main: function(msgData, msgArray) {
    bingSearch(msgArray.join(' ')).then(res => {
      msgData.channel.send(res)
    })
  }
}

function bingSearch(query) {
  return fetch('https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=' + urlencode(query), {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.BING_KEY_ONE,
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    if (data.value.length == 0){
      return 'No results'
    } else {
      return data.value[Math.floor(Math.random() * data.value.length)].contentUrl
    }
  })
}
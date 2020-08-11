const fetch = require('node-fetch')
const urlencode = require('urlencode')

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
    bingSearch(msgArray.join(' ')).then(link => {
      msgData.channel.send(link)
   })
  }
}

function bingSearch(query) {
  return fetch('https://api.cognitive.microsoft.com/bing/v7.0/search?q=' + urlencode(query), {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.BING_KEY_ONE,
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    console.log(data)
    if (data.value.length == 0){
      return 'No results'
    } else {
      return data.value[Math.floor(Math.random() * data.value.length)].contentUrl
    }
  })
} 
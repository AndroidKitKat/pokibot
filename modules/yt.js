const fetch = require('node-fetch')
const urlencode = require('urlencode')

module.exports = {
  info: {
    name: 'BING VIEDOS BABY',
    desc: 'This module searches BING for content',
    // if your function needs access to the database, make sure to set this to true
    database: false,
    command: 'yt',
    example: `!yt horses
  > video of some horses idk`
  },

  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {
      resolve(bingSearch(msgArray.join(' ')))
    })
  }
}

function bingSearch(query) {
  return fetch('https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=' + urlencode(query), {
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
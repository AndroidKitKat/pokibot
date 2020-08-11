const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

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
  let credentials = new CognitiveServicesCredentials(process.env.BING_KEY_ONE);
  let webSearchApiClient = new WebSearchAPIClient(credentials);
  return webSearchApiClient.web.search(query).then((result) => {
    if (result.images === undefined) {
      return 'No results'
    }
    return result.images.value[Math.floor(Math.random() * result.images.value.length)].contentUrl
})
}
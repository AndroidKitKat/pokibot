const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

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
  let credentials = new CognitiveServicesCredentials(process.env.BING_KEY_ONE);
  let webSearchApiClient = new WebSearchAPIClient(credentials);
  return webSearchApiClient.web.search(query).then((result) => {
    return result.webPages.value[Math.floor(Math.random() * result.webPages.value.length)].url
})
}
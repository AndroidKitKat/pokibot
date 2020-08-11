const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

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
    bingSearch(msgArray.join(' ')).then(res => {
      msgData.channel.send(res)
    })
  }
}

function bingSearch(query) {
  let credentials = new CognitiveServicesCredentials(process.env.BING_KEY_ONE);
  let webSearchApiClient = new WebSearchAPIClient(credentials);
  return webSearchApiClient.web.search(query).then((result) => {
    if (result.videos === undefined) {
      return 'No results'
    }
    return result.videos.value[Math.floor(Math.random() * result.videos.value.length)].contentUrl
})
}
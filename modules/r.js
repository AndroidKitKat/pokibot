const { default: fetch } = require('node-fetch')
const Discord = require('discord.js')

module.exports = {
  info: {
    name: 'Reddit',
    desc: 'Gets post from reddit',
    database: false,
    command: 'r',
    example: `!r mac
  > Returns a random post from the front page of /r/mac`
  },

  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {
      const subreddit = msgArray.shift()
      var redditEmbed = new Discord.MessageEmbed()
      if (msgArray.length > 0) {
        resolve(['Hey, sooo you can\'t have a sub name longer than one word. Try again ^.^'])
      } else if (subreddit.length > 21) {
        resolve(['Hey, soooo subreddit names can\'t be that long. Try again :pokishy:'])
      }
      var url = 'https://reddit.com/r/' + subreddit + '/.json'
      fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
        }
      }).then(res => {
        return res.json()
      }).then(data => {
        try {
          // wrong sub name
          if (data.data.children.length === 0) {
            resolve(['Hmmmmmmm, I can\'t seem to find that sub. Try again?'])
          }
          var post = data.data.children[Math.floor(Math.random() * data.data.children.length)]
          redditEmbed.setColor('#B7EA8')
            .setDescription(post.data.selftext.substr(0, 1024))
            .setTitle(post.data.title)
            .setURL(post.data.url)
            .setThumbnail('https://i.imgur.com/9VoQjPH.png')
            .setImage(post.data.url)
            // .setImage(post.data.preview.images.resolutions[0].url)
          resolve([redditEmbed])
        } catch (err) {
          resolve(['We hit a snag. Perhaps that sub was banned'])
        }
      })
    })
  }
}

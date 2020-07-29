const Discord = require('discord.js')

module.exports = {
  info: {
    name: 'Simp Alert',
    desc: 'Stop being such a simp lmao',
    database: false,
    command: 'simp',
    example: `!simp alert
  > You're such a simp`
  },
  // function MUST be called main
  main: function(msgData, msgArray) {
    if (msgArray.shift() === 'alert') {
      msgData.channel.send(new Discord.MessageEmbed()
        .setTitle('Hey man')
        .setDescription('We only simp ironically here.')
        .setImage('https://dxt.resized.co/dexerto/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMjBcXFwvMDZcXFwvMzAyMTQ1MTlcXFwvcG9raW1hbmVjb21tZW50c2ltcGFubm95aW5nLmdpZlwiLFwid2lkdGhcIjo2MjAsXCJoZWlnaHRcIjozNDcsXCJkZWZhdWx0XCI6XCJodHRwczpcXFwvXFxcL2ltYWdlcy5kZXhlcnRvLmNvbVxcXC91cGxvYWRzXFxcLzIwMTlcXFwvMTFcXFwvMTEyMTQ5NDNcXFwvcGxhY2Vob2xkZXIuanBnXCIsXCJvcHRpb25zXCI6e1wib3V0cHV0XCI6XCJ3ZWJwXCJ9fSIsImhhc2giOiJmNjk1Y2Y2MGZkOGQ2MjdiYTBlNGE5NTU5YWE2ZWIwYThlZGE4MzdlIn0=/pokimane-reveals-how-she-deals-with-annoying-online-simp-comments.gif')
        .setColor('#eb3327'))
    }
  }
}

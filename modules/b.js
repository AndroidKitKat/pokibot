module.exports = {
  info: {
    name: 'b',
    desc: '🅱-ifies a message.',
    database: false,
    command: 'b',
    example: `!b -c Let's go to Chipotle.
> Let's go to 🅱hipotle.`
  },
  main: function(msgData, msgArray) {
    return new Promise((resolve, reject) => {

      if(!msgArray){
        resolve(['**Usage:** !b -[flags] [message]'])
      }

      var response = ''
      var vowels = new Set(['a', 'e', 'i', 'o', 'u']);
      var special = new Set([]);

      if(msgArray[0].startsWith('-')){
        var flag = msgArray.shift().substr(1);
        for(var i = 0; i < flag.length; i++){
          special.add(flag.charAt(i));
        }

        vowels = new Set([...special].filter(x => vowels.has(x)));
      }

      for(var i = 0; i < msgArray.length; i++){

        if(msgArray[i] == ""){
          response += " ";
          continue;
        }

        var curr = msgArray[i][0].toLowerCase()

        if(vowels.has(curr)){
          response += '🅱' + msgArray[i] + " "
        }else if(special.has(curr) || special.size == 0){
            response += '🅱' + msgArray[i].substr(1) + " ";
        }else{
            response += msgArray[i] + " ";
        }
      }

      resolve([response]);
    })
  }
}

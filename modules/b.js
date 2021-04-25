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

      var phrase = msgArray.join(' ')

      if(!phrase){
        resolve(['**Usage:** !b -[flags] [message]'])
      }

      var response = ''
      var vowels = new Set(['a', 'e', 'i', 'o', 'u']);
      var special = new Set([]);

      if(phrase.startsWith('-')){
        var flag = phrase.substr(1, phrase.indexOf(' ') - 1);
        phrase = phrase.substr(phrase.indexOf(' ') + 1).split(" ");
        for(var i = 0; i < flag.length; i++){
          special.add(flag.charAt(i));
        }

        vowels = new Set([...special].filter(x => vowels.has(x)));
      }else{
        phrase = phrase.split(" ");
      }

      for(var i = 0; i < phrase.length; i++){
        if(phrase[i] == ""){
          response += " ";
          continue;
        }

        var curr = phrase[i][0].toLowerCase()

        if(vowels.has(curr)){
          response += '🅱' + phrase[i] + " "
        }else if(special.has(curr) || special.size == 0){
            response += '🅱' + phrase[i].substr(1) + " ";
        }else{
            response += phrase[i] + " ";
        }
      }

      resolve([response]);
    })
  }
}

module.exports = {
  info: {
    name: 'Example',
    desc: 'This is the example module, it is a template for people writing modules',
    // if your function needs access to the database, make sure to set this to true
    database: true,
    command: 'example',
    example: `!example
> This is coming from the exmaple module`
  },
  // pass in the message object, the message array. if you have database: true, make sure to pass in the db
  // function MUST be called main
  main: function(msgData, msgArray, dbObject) {
    msgData.channel.send('This is coming from the example module!')
  }
}

// if you want to use a function in your module, just write one and then call it in your main function!
function helperFunction() {
  console.log('hi, im a helper function')
}

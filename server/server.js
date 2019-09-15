var app = require('express')();
var http = require('http');


var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

var ioPrivate = io.of('/private');
users = {};
nicknames = []

ioPrivate.on('connection', function(socketPrivate){
  console.log('private message')
  console.log(nicknames)
  io.emit('broadcast', nicknames)

  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }
  
  socketPrivate.on('register-user', function(data){
    if(users[data.nickname] != undefined){
        socketIds = users[data.nickname];
        socketIds.push(data.socketId);
        users[data.nickname] = socketIds.filter(onlyUnique);
    }else{
        users[data.nickname] = [data.socketId];
        nicknames.push(data.nickname)
        io.emit('broadcast', nicknames)
    }
    
  })

  socketPrivate.on('private-message', function(data){
    recipientId = users[data.nickname];
    for (var i = 0; i < recipientId.length; i++) {
      ioPrivate.to(recipientId[i]).emit('new_private_message', data);
    }
  })
})

ioPrivate.on('disconnect', function(data){
    console.log('Disconnect');
})



httpServer.listen(3001, function () {
  console.log('listening on *:3001')
});

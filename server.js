var app = require('express')();
var http = require('http');


var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

/**
 * Notif test
 */

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var ioPrivate = io.of('/private');
users = {};
ioPrivate.on('connection', function(socketPrivate){
  console.log('private message')

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

httpServer.listen(3000, function () {
  console.log('listening on *:3000')
});

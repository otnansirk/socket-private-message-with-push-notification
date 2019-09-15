var app = require('express')()
var http = require('http').createServer(app)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html')
})

http.listen(3000, function(){
    console.log("listen 3000")
})
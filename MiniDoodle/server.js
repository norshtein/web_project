var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

var line_history = [];

io.on('connection', function (socket) {

   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   socket.on('draw_line', function (data) {
      // add received line to history 
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });

   socket.on('clear',function() {
       console.log("clear request");
       line_history = [];
       io.emit('clear');
   });
});
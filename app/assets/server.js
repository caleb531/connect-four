/* eslint-disable no-console */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// WARNING: app.listen(8080) will NOT work here!
server.listen(8080, () => {
  console.log('Server started. Listening on port 8080');
});

app.use(express.static(__dirname));

io.on('connection', function (socket) {

  console.log('new connection');

  socket.on('disconnect', () => {
    console.log('disconnect');
  });

});

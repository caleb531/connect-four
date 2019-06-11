/* eslint-disable no-console */
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let RoomManager = require('./room-manager.js');

// Express server

// Warning: app.listen(8080) will not work here
server.listen(8080, () => {
  console.log('Server started. Listening on port 8080');
});

app.use(express.static(__dirname));

// Socket.IO

let roomManager = new RoomManager();

io.on('connection', function (socket) {

  console.log('new connection', socket.id);

  socket.on('new-room', ({ firstPlayer }, fn) => {
    firstPlayer.socket = socket;
    let room = roomManager.openRoom({ firstPlayer });
    socket.join(room.code);
    fn({ room });
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
  });

});

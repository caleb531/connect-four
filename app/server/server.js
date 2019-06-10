/* eslint-disable no-console */
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let RoomManager = require('./room-manager.js');
let PlayerManager = require('./player-manager.js');

// Express server

// Warning: app.listen(8080) will not work here
server.listen(8080, () => {
  console.log('Server started. Listening on port 8080');
});

app.use(express.static(__dirname));

// Socket.IO

let roomManager = new RoomManager();
let playerManager = new PlayerManager();

io.on('connection', function (socket) {

  console.log('new connection', socket.id);
  playerManager.addNewPlayer({ socket });

  socket.on('new-room', ({ currentPlayer }) => {
    let room = roomManager.openNewRoom({ currentPlayer });
    console.log(room.code);
    socket.join(room.code);
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
  });

});

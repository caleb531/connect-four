/* eslint-disable no-console */
import express from 'express';
import compression from 'compression';
import http from 'http';
import path from 'path';
import socketio from 'socket.io';

import RoomManager from './room-manager.js';

// Express server

let app = express();
let server = http.Server(app);
let io = socketio(server);

// Serve assets using gzip compression
app.use(compression());

// Warning: app.listen(8080) will not work here
server.listen(8080, () => {
  console.log('Server started. Listening on port 8080');
});

app.get('/room/:roomCode', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

// Socket.IO

let roomManager = new RoomManager();

io.on('connection', function (socket) {

  console.log('connected:', socket.id);

  socket.on('new-room', ({ firstPlayer }, fn) => {
    firstPlayer.socket = socket;
    let room = roomManager.openRoom({ firstPlayer });
    socket.join(room.code);
    fn({ room });
  });

  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });

});

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

io.on('connection', (socket) => {

  console.log('connected:', socket.id);

  socket.on('new-room', ({ player }, fn) => {
    console.log(player);
    let room = roomManager.openRoom();
    player = room.addPlayer({ player, socket });
    socket.join(room.code);
    fn({
      status: 'waiting-for-players',
      room, player
    });
  });

  socket.on('join-room', ({ roomCode, playerId }, fn) => {
    console.log('join room by player', playerId);
    let room = roomManager.getRoom(roomCode);
    let player = room.connectPlayer({ playerId, socket });
    socket.join(room.code);
    let status;
    console.log(player && player.name, room.players.length);
    if (player) {
      if (room.players.length === 1) {
        status = 'waiting-for-players';
      } else {
        status = 'returning-player';
      }
    } else {
      status = 'new-player';
    }
    fn({ status, room, player });
  });

  socket.on('new-player', ({ roomCode, player }, fn) => {
    let room = roomManager.getRoom(roomCode);
    player = room.addPlayer({ player, socket });
    room.startGame();
    fn({
      status: 'startGame',
      room, player
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
    // Indicate that this player is now disconnected
    if (socket.player) {
      console.log('unset player socket');
      socket.player.socket = null;
    }
  });

});

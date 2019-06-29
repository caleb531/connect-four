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
  res.sendFile(path.join(path.dirname(__dirname), 'index.html'));
});

app.get('/room', (req, res) => {
  res.sendFile(path.join(path.dirname(__dirname), 'index.html'));
});

app.use(express.static(path.dirname(__dirname)));

// Socket.IO

let roomManager = new RoomManager();

io.on('connection', (socket) => {

  console.log(`connected: ${socket.id}`);

  socket.on('open-room', ({ player }, fn) => {
    console.log(`open room by player ${player.name}`);
    let room = roomManager.openRoom();
    let localPlayer = room.addPlayer({ player, socket });
    fn({
      status: 'waitingForPlayers',
      roomCode: room.code,
      game: room.game,
      localPlayer
    });
  });

  socket.on('join-room', ({ roomCode, playerId }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log(`join room by player ${playerId}`);
      let localPlayer = room.connectPlayer({ playerId, socket });
      let status;
      if (localPlayer) {
        if (room.players.length === 1) {
          status = 'waitingForPlayers';
        } else {
          status = 'returningPlayer';
        }
      } else {
        status = 'newPlayer';
      }
      fn({
        status,
        game: room.game,
        localPlayer
      });
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('add-player', ({ roomCode, player }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log(`add player to room ${roomCode}`);
      let localPlayer = room.addPlayer({ player, socket });
      let otherPlayer = room.game.getOtherPlayer(localPlayer);
      room.game.startGame();
      // Automatically update first player's screen when second player joins
      if (otherPlayer.socket) {
        console.log('sending updated game to P1');
        otherPlayer.socket.emit('add-player', {
          status: 'addedPlayer',
          game: room.game,
          localPlayer: otherPlayer
        });
      } else {
        console.log('unable to send updated game to P1');
      }
      fn({
        status: 'startGame',
        game: room.game,
        localPlayer
      });
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('place-chip', ({ roomCode, column }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log(`place chip ${roomCode}`);
      if (column !== null) {
        room.game.placeChip({ column });
        // After placeChip() is called, the turn ends for the player who placed
        // the chip, making the other player the new current player
        column = room.game.grid.lastPlacedChip.column;
        room.game.currentPlayer.socket.emit('receive-next-move', { column });
      }
      fn({ status: 'placeChip', column });
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('end-game', ({ playerId, roomCode }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log('end game', playerId);
      room.game.endGame();
      let localPlayer = room.getPlayerById(playerId);
      room.game.requestingPlayer = localPlayer;
      room.players.forEach((player) => {
        if (player.socket) {
          player.socket.emit('end-game', {
            status: 'endGame',
            requestingPlayer: room.game.requestingPlayer
          });
        }
      });
      fn({
        status: 'endGame',
        requestingPlayer: localPlayer
      });
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('align-pending-chip', ({ roomCode, column }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      room.game.pendingChipColumn = column;
      let otherPlayer = room.game.getOtherPlayer();
      if (otherPlayer.socket) {
        otherPlayer.socket.emit('align-pending-chip', { column });
      }
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`disconnected: ${socket.id}`);
    // Indicate that this player is now disconnected
    if (socket.player) {
      console.log('unset player socket');
      socket.player.socket = null;
    }
  });

});

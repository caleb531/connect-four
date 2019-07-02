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
      localUser: localPlayer
    });
  });

  socket.on('join-room', ({ roomCode, userId }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log(`join room by ${userId}`);
      roomManager.markRoomAsActive(room);
      let localPlayer = room.connectPlayer({ userId, socket });
      let status;
      if (localPlayer) {
        if (room.players.length === 1) {
          status = 'waitingForPlayers';
        } else if (room.game.pendingNewGame && localPlayer === room.game.requestingPlayer) {
          status = 'requestingNewGame';
        } else if (room.game.pendingNewGame && localPlayer !== room.game.requestingPlayer) {
          status = 'newGameRequested';
        } else {
          status = 'returningPlayer';
        }
      } else if (room.players.length === 2) {
        // If both players are currently connected, all future connections
        // represent spectators
        status = 'watchingGame';
      } else {
        status = 'newPlayer';
      }
      fn({
        status,
        game: room.game,
        localUser: localPlayer
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
          localUser: otherPlayer
        });
      } else {
        console.log('unable to send updated game to P1');
      }
      fn({
        status: 'startGame',
        game: room.game,
        localUser: localPlayer
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
        if (room.game.currentPlayer.socket) {
          room.game.currentPlayer.socket.emit('receive-next-move', { column });
        }
      }
      fn({ status: 'placeChip', column });
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('end-game', ({ userId, roomCode }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log('end game', userId);
      room.game.endGame();
      let localPlayer = room.getPlayerById(userId);
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

  socket.on('request-new-game', ({ userId, roomCode, winner }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      console.log('request new game', userId);
      let localPlayer = room.getPlayerById(userId);
      localPlayer.lastSubmittedWinner = winner;
      let otherPlayer = room.game.getOtherPlayer(localPlayer);
      // When either player requests to start a new game, each player must
      // submit the winner for that game, if any; this is because the logic
      // which analyzes the grid for a winner is client-side, at least for now;
      // to accomplish this, each player's submitted winner will be stored on
      // the respective player object;
      let submittedWinners = room.players.map((player) => player.lastSubmittedWinner);
      // If the local player is the first to request a new game, ask the other
      // player if they'd like to start a new game
      if (!room.game.pendingNewGame) {
        room.game.requestingPlayer = localPlayer;
        room.game.pendingNewGame = true;
        if (otherPlayer.socket) {
          otherPlayer.socket.emit('request-new-game', {
            status: 'newGameRequested',
            requestingPlayer: room.game.requestingPlayer,
            localUser: otherPlayer
          });
        }
        // Inform the local player (who requested the new game) that their
        // request is pending
        fn({ status: 'requestingNewGame', localUser: localPlayer });
      } else if (submittedWinners.length === 2 && localPlayer !== room.game.requestingPlayer) {
        // If the other player accepts the original request to play again, start
        // a new game and broadcast the new game state to both players
        room.game.declareWinner();
        room.game.resetGame();
        room.game.startGame();
        room.players.forEach((player) => {
          if (player.socket) {
            player.socket.emit('start-new-game', {
              status: 'startGame',
              game: room.game,
              localUser: player
            });
          }
        });
        fn({ status: 'startGame', localUser: localPlayer });
      }
    } else {
      console.log(`room ${roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  });

  socket.on('align-pending-chip', ({ roomCode, column }, fn) => {
    let room = roomManager.getRoom(roomCode);
    if (room) {
      room.game.grid.pendingChipColumn = column;
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
    if (socket.user) {
      console.log('unset player socket');
      socket.user.socket = null;
    }
    // As soon as both players disconnect from the room (making it completely
    // empty), mark the room for deletion
    if (socket.room && !socket.room.isActive()) {
      roomManager.markRoomAsInactive(socket.room);
    }
  });

});

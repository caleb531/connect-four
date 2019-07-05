import socketio from 'socket.io';

import server from './express-server.js';
import RoomManager from './room-manager.js';

// Socket.IO

const io = socketio(server);
const roomManager = new RoomManager();

// A wrapper around RoomManager.getRoom() to run the given callback if the
// specified room exists, otherwise responding with an error message if the room
// does not exist
function getRoom(callback) {
  return (options, fn) => {
    options.room = roomManager.getRoom(options.roomCode);
    if (options.room) {
      callback(options, fn);
    } else {
      console.log(`room ${options.roomCode} not found`);
      fn({ status: 'roomNotFound' });
    }
  };
}

io.on('connection', (socket) => {

  console.log(`connected: ${socket.id}`);

  // Room events

  socket.on('open-room', ({ player }, fn) => {
    console.log(`open room by player ${player.name}`);
    const room = roomManager.openRoom();
    const localPlayer = room.addPlayer({ player, socket });
    fn({
      status: 'waitingForPlayers',
      roomCode: room.code,
      game: room.game,
      localPlayer
    });
  });

  socket.on('join-room', getRoom(({ room, playerId }, fn) => {
    console.log(`join room by ${playerId}`);
    roomManager.markRoomAsActive(room);
    const localPlayer = room.connectPlayer({ playerId, socket });
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
      // If this join-room call represents a player reconnecting to the game
      // (where they were previously disconnected), inform the other player that
      // they have reconnected
      const otherPlayer = room.game.getOtherPlayer(localPlayer);
      if (otherPlayer && otherPlayer.socket) {
        delete localPlayer.lastDisconnectReason;
        otherPlayer.socket.emit('player-reconnected', {
          // If the game is still pending, make sure to stay in a pending state,
          // otherwise we can clear the status message
          status: room.game.pendingNewGame ? null : 'playerReconnected',
          localPlayer: otherPlayer
        });
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
      localPlayer
    });
  }));

  socket.on('close-room', getRoom(({ room }, fn) => {
    roomManager.closeRoom(room);
    fn({ status: 'closedRoom' });
  }));

  socket.on('decline-new-game', getRoom(({ playerId, room }, fn) => {
    console.log(`decline new game by ${playerId}`);
    const localPlayer = room.getPlayerById(playerId);
    localPlayer.lastDisconnectReason = 'newGameDeclined';
    room.game.pendingNewGame = false;
    fn({});
  }));

  socket.on('add-player', getRoom(({ room, player }, fn) => {
    console.log(`add player to room ${room.code}`);
    const localPlayer = room.addPlayer({ player, socket });
    const otherPlayer = room.game.getOtherPlayer(localPlayer);
    room.game.startGame();
    // Automatically update first player's screen when second player joins
    if (otherPlayer && otherPlayer.socket) {
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
      status: 'startedGame',
      game: room.game,
      localPlayer
    });
  }));

  // Gameplay events

  socket.on('align-pending-chip', getRoom(({ room, column }, fn) => {
    room.game.grid.pendingChipColumn = column;
    const otherPlayer = room.game.getOtherPlayer();
    if (otherPlayer && otherPlayer.socket) {
      otherPlayer.socket.emit('align-pending-chip', { column });
    }
    fn({});
  }));

  socket.on('place-chip', getRoom(({ room, column }, fn) => {
    console.log(`place chip ${room.code}`);
    if (column !== null) {
      room.game.placeChip({ column });
      // After placeChip() is called, the turn ends for the player who placed
      // the chip, making the other player the new current player
      column = room.game.grid.lastPlacedChip.column;
      if (room.game.currentPlayer && room.game.currentPlayer.socket) {
        console.log('receive next move');
        room.game.currentPlayer.socket.emit('receive-next-move', { column });
      } else {
        console.log('did not receive next move');
        console.log('current player:', room.game.currentPlayer);
      }
    }
    fn({ status: 'placedChip', column });
  }));

  // Game management events

  socket.on('end-game', getRoom(({ playerId, room }, fn) => {
    console.log('end game', playerId);
    room.game.endGame();
    const localPlayer = room.getPlayerById(playerId);
    room.game.requestingPlayer = localPlayer;
    room.players.forEach((player) => {
      if (player.socket) {
        player.socket.emit('end-game', {
          status: 'endedGame',
          requestingPlayer: room.game.requestingPlayer
        });
      }
    });
    fn({
      status: 'endedGame',
      requestingPlayer: localPlayer
    });
  }));

  socket.on('request-new-game', getRoom(({ playerId, room, winner }, fn) => {
    console.log('request new game', playerId);
    const localPlayer = room.getPlayerById(playerId);
    localPlayer.lastSubmittedWinner = winner;
    const otherPlayer = room.game.getOtherPlayer(localPlayer);
    // When either player requests to start a new game, each player must
    // submit the winner for that game, if any; this is because the logic
    // which analyzes the grid for a winner is client-side, at least for now;
    // to accomplish this, each player's submitted winner will be stored on
    // the respective player object;
    const submittedWinners = room.players.map((player) => player.lastSubmittedWinner);
    // If the local player is the first to request a new game, ask the other
    // player if they'd like to start a new game
    if (!room.game.pendingNewGame) {
      room.game.requestingPlayer = localPlayer;
      room.game.pendingNewGame = true;
      if (otherPlayer && otherPlayer.socket) {
        otherPlayer.socket.emit('request-new-game', {
          status: 'newGameRequested',
          requestingPlayer: room.game.requestingPlayer,
          localPlayer: otherPlayer
        });
      }
      // Inform the local player (who requested the new game) that their
      // request is pending
      fn({ status: 'requestingNewGame', localPlayer });
    } else if (submittedWinners.length === 2 && localPlayer !== room.game.requestingPlayer) {
      // If the other player accepts the original request to play again, start
      // a new game and broadcast the new game state to both players
      room.game.declareWinner();
      room.game.resetGame();
      room.game.startGame();
      room.players.forEach((player) => {
        if (player.socket) {
          player.socket.emit('start-new-game', {
            status: 'startedGame',
            game: room.game,
            localPlayer: player
          });
        }
      });
      fn({ status: 'startedGame', localPlayer });
    }
  }));

  socket.on('disconnect', () => {
    console.log(`disconnected: ${socket.id}`);
    // Indicate that this player is now disconnected
    if (socket.player) {
      console.log('unset player socket');
      socket.player.socket = null;
      if (socket.room) {
        const otherPlayer = socket.room.game.getOtherPlayer(socket.player);
        if (otherPlayer && otherPlayer.socket) {
          otherPlayer.socket.emit('player-disconnected', {
            localPlayer: otherPlayer,
            disconnectedPlayer: socket.player
          });
        }
      }
    }
    // As soon as both players disconnect from the room (making it completely
    // empty), mark the room for deletion
    if (socket.room && !socket.room.isActive()) {
      roomManager.markRoomAsInactive(socket.room);
    }
  });

});

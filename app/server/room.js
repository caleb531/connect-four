import random from 'random';

import Player from './player.js';

class Room {

  constructor({ code, players = [], gridHistory = [] }) {
    this.code = code;
    this.players = players;
    this.gridHistory = gridHistory;
    // The index of the starting player for the current game
    this.startingPlayer = null;
  }

  addPlayer({ player, socket }) {
    player = new Player(player);
    this.players.push(player);
    player.socket = socket;
    socket.player = player;
    return player;
  }

  getPlayerById(playerId) {
    return this.players.find((player) => player.id === playerId);
  }

  getFirstDisconnectedPlayer() {
    return this.players.find((player) => {
      console.log('socket i', player.socket && player.socket.id);
      return player.socket === null;
    });
  }

  connectPlayer({ playerId, socket }) {
    let player = this.getPlayerById(playerId) || this.getFirstDisconnectedPlayer();
    if (player) {
      player.socket = socket;
      socket.player = player;
    }
    console.log('displayer', this.getFirstDisconnectedPlayer());
    return player;
  }

  startGame() {
    // The first game for a room should pick a starting player at random;
    // successive games will alternate starting player
    this.startingPlayer = random.int(0, this.players.length - 1);
  }

}

export default Room;

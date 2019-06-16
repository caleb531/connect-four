import Player from './player.js';

class Room {

  constructor({ code, players = [], gridHistory = [] }) {
    this.code = code;
    this.players = players;
    this.gridHistory = gridHistory;
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

}

export default Room;

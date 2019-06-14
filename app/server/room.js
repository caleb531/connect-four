import Player from './player.js';

class Room {

  constructor({ code, players = [], gridHistory = [] }) {
    this.code = code;
    this.players = players;
    this.gridHistory = gridHistory;
  }

  addPlayer(player) {
    player = new Player(player);
    this.players.push(player);
    return player;
  }

  getFirstDisconnectedPlayer() {
    return this.players.find((player) => player.socket === null);
  }

}

export default Room;

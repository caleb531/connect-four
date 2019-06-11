let Player = require('./player.js');

class Room {

  constructor({ code, players = [], gridHistory = [] }) {
    this.code = code;
    this.players = players.map((player) => new Player(player));
    this.gridHistory = gridHistory;
  }

}

module.exports = Room;

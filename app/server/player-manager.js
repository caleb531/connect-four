let Player = require('./player.js');

class PlayerManager {

  constructor() {
    this.players = [];
  }

  addNewPlayer({ socket }) {
    this.players.push(new Player({
      socket: socket
    }));
  }

}

module.exports = PlayerManager;

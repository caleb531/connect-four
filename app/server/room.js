class Room {

  constructor({ players = [], gridHistory = [] }) {
    this.players = players;
    this.gridHistory = gridHistory;
  }

}

module.exports = Room;

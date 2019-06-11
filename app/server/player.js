class Player {

  constructor({ socket }) {
    // The identifier for this player, unique on a per-room level
    this.id = Date.now();
    // The current socket assocuat
    this.socket = socket;
    // The player's total number of wins across all games
    this.score = 0;
  }

  toJSON() {
    return {
      name: this.name,
      score: this.score
    };
  }

}

module.exports = Player;

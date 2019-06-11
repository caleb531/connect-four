class Player {

  /* eslint-disable no-shadow */
  constructor({ name, color, socket }) {
    // The name of the player as entered by the user
    this.name = name;
    // The user-defined color of the user as defined by the client
    this.color = color;
    // The current socket associated with this player; this will be updated by
    // the server when the socket is disconnected
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

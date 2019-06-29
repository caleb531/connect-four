import uuidv4 from 'uuid/v4';

class Player {

  /* eslint-disable no-shadow */
  constructor({ name, color, socket, score = 0 }) {
    // A unique identifier for this player; this only needs to be unique within
    // the scope of a room
    this.id = uuidv4();
    // The current socket associated with this player; this will be updated by
    // the server when the socket is disconnected
    this.socket = socket;
    // The name of the player as entered by the user
    this.name = name;
    // The user-defined color of the user as defined by the client
    this.color = color;
    // The player's total number of wins across all games
    this.score = score;
    // The last winner submitted by the player to the server; a value of null
    // either means that the player has never submitted a winner, or that the
    // last game ended in a tie
    this.lastSubmittedWinner = null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      score: this.score
    };
  }

}

export default Player;

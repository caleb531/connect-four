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
  }

  toJSON() {
    return {
      name: this.name,
      color: this.color,
      score: this.score
    };
  }

}

export default Player;

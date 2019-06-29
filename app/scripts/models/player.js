// An abstract base model representing a player in a game
class Player {

  /* eslint-disable no-shadow */
  constructor({ name, color, score = 0 }) {
    // The name of the player (e.g. 'Human 1')
    this.name = name;
    // The player's chip color (supported colors are black, blue, and red)
    this.color = color;
    // The player's total number of wins across all games
    this.score = score;
  }

}

export default Player;

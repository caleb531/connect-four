// An abstract base model representing a player in a game
function Player(args) {
  // The name of the player (e.g. 'Human 1')
  this.name = args.name;
  // The player's chip color (supported colors are black, blue, and red)
  this.color = args.color;
  // The player's total number of wins across all games
  this.score = 0;
}

export default Player;

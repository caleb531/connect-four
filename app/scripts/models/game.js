import Emitter from 'tiny-emitter';
import Grid from './grid';
import HumanPlayer from './human-player';
import AIPlayer from './ai-player';
import Chip from './chip';

// A singleton representing a game between two players; the same Game instance
// is re-used for successive "games"
function Game(args) {
  if (args && args.grid) {
    this.grid = args.grid;
  } else {
    this.grid = new Grid({
      columnCount: 7,
      rowCount: 6
    });
  }
  if (args && args.players) {
    this.players = args.players;
  } else {
    this.players = [];
  }
  // The number of human players (if 1, assume the other player is an AI)
  this.humanPlayerCount = null;
  // The current player is null when a game is not in progress
  this.currentPlayer = null;
  // Whether or not the game is in progress
  this.inProgress = false;
  // The chip above the grid that is about to be placed
  this.pendingChip = null;
  // The winning player of the game
  this.winner = null;
  // Game inherits from Emitter
  Emitter.call(this);
  // Keep track of the columns where chips are placed in debug mode (extremely
  // useful for creating new unit tests from real games)
  if (args && args.debug) {
    this.debug = true;
    this.columnHistory = [];
  } else {
    this.debug = false;
  }
}

Game.prototype = Object.create(Emitter.prototype);

Game.prototype.startGame = function (args) {
  if (args && args.startingPlayer) {
    this.currentPlayer = args.startingPlayer;
  } else {
    this.currentPlayer = this.players[0];
  }
  this.inProgress = true;
  this.emit('game:start');
  this.startTurn();
};

// End the game without resetting the grid
Game.prototype.endGame = function () {
  if (this.winner) {
    this.winner.score += 1;
  }
  this.inProgress = false;
  this.currentPlayer = null;
  this.pendingChip = null;
  this.emit('game:end');
  this.humanPlayerCount = null;
  if (this.debug) {
    this.columnHistory.length = 0;
  }
};

// Reset the game and grid completely without starting a new game (endGame
// should be called somewhere before this method is called)
Game.prototype.resetGame = function () {
  this.winner = null;
  this.grid.resetGrid();
};

// Initialize or change the current set of players
Game.prototype.setPlayers = function (newHumanPlayerCount) {
  // Instantiate new players as needed (if user is about to play the first game
  // or if the user is switching modes)
  if (this.players.length === 0) {
    if (newHumanPlayerCount === 1) {
      // If user chose 1-Player mode, the user will play against the AI
      this.players.push(new HumanPlayer({name: 'Human', color: 'red'}));
      this.players.push(new AIPlayer({name: 'Mr. AI', color: 'black'}));
    } else {
      // Otherwise, the user will play against another human
      this.players.push(new HumanPlayer({name: 'Human 1', color: 'red'}));
      this.players.push(new HumanPlayer({name: 'Human 2', color: 'blue'}));
    }
  } else if ((newHumanPlayerCount === 1 && this.players[1].type !== 'ai') || (newHumanPlayerCount === 2 && this.players[1].type !== 'human')) {
    // If user switches from 1-Player to 2-Player mode (or vice-versa), recreate
    // set of players
    this.players.length = 0;
    this.setPlayers(newHumanPlayerCount);
    return;
  }
  this.humanPlayerCount = newHumanPlayerCount;
};

// Retrieve the player that isn't the given player
Game.prototype.getOtherPlayer = function (player) {
  if (player === this.players[0]) {
    return this.players[1];
  } else {
    return this.players[0];
  }
};

// Start the turn of the current player
Game.prototype.startTurn = function () {
  this.pendingChip = new Chip({player: this.currentPlayer});
  if (this.currentPlayer.type === 'ai') {
    var bestMove = this.currentPlayer.computeNextMove(this);
    this.emit('ai-player:compute-next-move', this.currentPlayer, bestMove);
  }
};

// End the turn of the current player and switch to the next player
Game.prototype.endTurn = function () {
  if (this.inProgress) {
    // Switch to next player's turn
    this.currentPlayer = this.getOtherPlayer(this.currentPlayer);
    this.startTurn();
  }
};

// Insert the current pending chip into the columns array at the given index
Game.prototype.placePendingChip = function (args) {
  this.grid.placeChip({
    chip: this.pendingChip,
    column: args.column
  });
  if (this.debug) {
    this.columnHistory.push(args.column);
    // The column history will only be logged on non-production sites, so we
    // can safely disable the ESLint error
    // eslint-disable-next-line no-console
    console.log(this.columnHistory.join(', '));
  }
  this.pendingChip = null;
  // Check for winning connections (i.e. four in a row)
  this.checkForWin();
  // Check if the grid is completely full
  this.checkForTie();
  // If the above checks have not ended the game, continue to next player's
  // turn
  this.endTurn();
};

// Check if the game has tied, and end the game if it is
Game.prototype.checkForTie = function () {
  if (this.grid.checkIfFull()) {
    this.emit('game:declare-tie');
    this.endGame();
  }
};

// Determine if a player won the game with four chips in a row (horizontally,
// vertically, or diagonally)
Game.prototype.checkForWin = function () {
  var connections = this.grid.getConnections({
    baseChip: this.grid.lastPlacedChip,
    connectionSize: 4
  });
  if (connections.length > 0) {
    // Mark chips in only the first winning connection, and // only mark the
    // first four chips of this connection (since only a // connect-four is
    // needed to win
    connections[0].length = 4;
    connections[0].forEach(function (chip) {
      chip.winning = true;
    });
    this.winner = this.grid.lastPlacedChip.player;
    this.emit('game:declare-winner', this.winner);
    this.endGame();
  }
};

export default Game;

'use strict';

var Grid = require('./grid');
var Player = require('./player');
var Chip = require('./chip');

// An AI player that can think for itself
function AIPlayer(args) {
  Player.call(this, args);
}
AIPlayer.prototype = Object.create(Player.prototype);
AIPlayer.prototype.type = 'ai';
// The duration to wait (in ms) for the user to process the AI player's actions
AIPlayer.waitDelay = 100;
// The maximum number of grid moves to look ahead (this determine's the AI's
// intelligence)
AIPlayer.maxComputeDepth = 4;

// Wait for a short moment to give the user time to see and process the AI
// player's actions
AIPlayer.prototype.wait = function (callback) {
  setTimeout(function () {
    callback();
  }, AIPlayer.waitDelay);
};

// Compute the column where the AI player should place its next chip
AIPlayer.prototype.computeNextMove = function (game) {
  var bestMove = this.maximizeMove(
    game.grid, game.players, AIPlayer.maxComputeDepth,
    Grid.minScore, Grid.maxScore);
  if (bestMove === null) {
    console.error('AI cannot decide on a column');
    return null;
  }
  // Choose next available column if original pick is full
  while (game.grid.getNextAvailableSlot({column: bestMove.column}) === null) {
    bestMove.column += 1;
  }
  game.emitter.emit('ai-player:compute-next-move', bestMove.column);
  return bestMove.column;
};

// Choose a column that will maximize the AI player's chances of winning
AIPlayer.prototype.maximizeMove = function (grid, players, depth, alpha, beta) {
  var gridScore = grid.getScore(this, this, players[0]);
  // If max search depth was reached or if winning grid was found
  if (depth === 0 || Math.abs(gridScore) === Grid.maxScore) {
    return {column: null, score: gridScore};
  }
  var bestMove = {column: null, score: Grid.minScore};
  for (var c = 0; c < grid.columnCount; c += 1) {
    // Clone the current grid and place a chip to generate a new permutation
    var nextGrid = new Grid(grid);
    nextGrid.placeChip({column: c, chip: new Chip({player: this})});
    // Minimize the opponent human player's chances of winning
    var nextMove = this.minimizeMove(nextGrid, players, depth - 1, alpha, beta);
    // If a better move is found, make that the tentative best move
    if (bestMove.column === null || nextMove.score > bestMove.score) {
      bestMove.column = c;
      bestMove.score = nextMove.score;
      alpha = nextMove.score;
    }
    // Stop if there are no moves better than the current best move
    if (alpha >= beta) {
      return bestMove;
    }
  }
  return bestMove;
};


// Choose a column that will minimize the human player's chances of winning
AIPlayer.prototype.minimizeMove = function (grid, players, depth, alpha, beta) {
  var gridScore = grid.getScore(players[0], this, players[0]);
  // If max search depth was reached or if winning grid was found
  if (depth === 0 || Math.abs(gridScore) === Grid.maxScore) {
    return {column: null, score: gridScore};
  }
  var worstMove = {column: null, score: Grid.maxScore};
  for (var c = 0; c < grid.columnCount; c += 1) {
    // Clone the current grid and place a chip to generate a new permutation
    var nextGrid = new Grid(grid);
    // The human playing against the AI is always the first player
    nextGrid.placeChip({column: c, chip: new Chip({player: players[0]})});
    // Minimize the opponent human player's chances of winning
    var nextMove = this.maximizeMove(nextGrid, players, depth - 1, alpha, beta);
    // If a worse move is found, make that the tentative worst move
    if (worstMove.column === null || nextMove.score < worstMove.score) {
      worstMove.column = c;
      worstMove.score = nextMove.score;
      beta = nextMove.score;
    }
    // Stop if there are no moves worse than the current worst move
    if (alpha >= beta) {
      return worstMove;
    }
  }
  return worstMove;
};

module.exports = AIPlayer;

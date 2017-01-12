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
  var maxMove = this.maximizeMove(
    game.grid, game.players, AIPlayer.maxComputeDepth,
    Grid.minScore, Grid.maxScore);
  if (maxMove === null) {
    console.error('AI cannot decide on a column');
    return null;
  }
  // Choose next available column if original pick is full
  while (game.grid.getNextAvailableSlot({column: maxMove.column}) === null) {
    maxMove.column += 1;
  }
  game.emitter.emit('ai-player:compute-next-move', maxMove.column);
  return maxMove.column;
};

// Choose a column that will maximize the AI player's chances of winning
AIPlayer.prototype.maximizeMove = function (grid, players, depth, alpha, beta) {
  var gridScore = grid.getScore(this, this, players[0]);
  // If max search depth was reached or if winning grid was found
  if (depth === 0 || Math.abs(gridScore) === Grid.maxScore) {
    return {column: null, score: gridScore};
  }
  var maxMove = {column: null, score: Grid.minScore};
  for (var c = 0; c < grid.columnCount; c += 1) {
    // Clone the current grid and place a chip to generate a new permutation
    var nextGrid = new Grid(grid);
    nextGrid.placeChip({column: c, chip: new Chip({player: this})});
    // Minimize the opponent human player's chances of winning
    var minMove = this.minimizeMove(nextGrid, players, depth - 1, alpha, beta);
    // If a move yields a lower opponent score, make it the tentative max move
    if (maxMove.column === null || minMove.score > maxMove.score) {
      maxMove.column = c;
      maxMove.score = minMove.score;
      alpha = minMove.score;
    }
    // Stop if there are no moves better than the current max move
    if (alpha >= beta) {
      return maxMove;
    }
  }
  return maxMove;
};


// Choose a column that will minimize the human player's chances of winning
AIPlayer.prototype.minimizeMove = function (grid, players, depth, alpha, beta) {
  var gridScore = grid.getScore(players[0], this, players[0]);
  // If max search depth was reached or if winning grid was found
  if (depth === 0 || Math.abs(gridScore) === Grid.maxScore) {
    return {column: null, score: gridScore};
  }
  var minMove = {column: null, score: Grid.maxScore};
  for (var c = 0; c < grid.columnCount; c += 1) {
    var nextGrid = new Grid(grid);
    // The human playing against the AI is always the first player
    nextGrid.placeChip({column: c, chip: new Chip({player: players[0]})});
    // Maximize the AI player's chances of winning
    var maxMove = this.maximizeMove(nextGrid, players, depth - 1, alpha, beta);
    // If a move yields a higher AI score, make it the tentative max move
    if (minMove.column === null || maxMove.score < minMove.score) {
      minMove.column = c;
      minMove.score = maxMove.score;
      beta = maxMove.score;
    }
    // Stop if there are no moves better than the current min move
    if (alpha >= beta) {
      return minMove;
    }
  }
  return minMove;
};

module.exports = AIPlayer;

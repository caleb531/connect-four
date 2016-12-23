'use strict';

var m = require('mithril');
var _ = require('underscore');
var Dashboard = require('./dashboard');
var Grid = require('./grid');
var Player = require('./player');
var Chip = require('./chip');

function Game(args) {
  this.grid = args.grid;
  this.players = [];
  // The current player is null when a game is not in progress
  this.currentPlayer = null;
  // Whether or not the game is in progress
  this.gameInProgress = false;
  // The chip above the grid that is about to be placed
  this.pendingChip = null;
  // The chip that was most recently placed in the board
  this.lastPlacedChip = null;
  // TODO: remove this when P2 mode testing is finished
  this.startGame();
}

Game.prototype.startGame = function (args) {
  // If 2-player game is selected, assume two human players
  this.players.push(new Player({color: 'red', playerNum: 1}));
  this.players.push(new Player({color: 'blue', playerNum: 2}));
  this.gameInProgress = true;
  this.currentPlayer = this.players[0];
  this.startTurn();
};

// Start the turn of the current player
Game.prototype.startTurn = function () {
  this.pendingChip = new Chip({player: this.currentPlayer});
};

// End the turn of the current player and switch to the next player
Game.prototype.endTurn = function () {
  // Switch to next player
  if (this.currentPlayer === this.players[0]) {
    this.currentPlayer = this.players[1];
  } else {
    this.currentPlayer = this.players[0];
  }
  this.startTurn();
};

// Return the index of the next available row for the given column
Game.prototype.getNextAvailableSlot = function (args) {
  var nextRowIndex = this.grid.columns[args.column].length;
  if (nextRowIndex < this.grid.rowCount) {
    return nextRowIndex;
  } else {
    // Return null if thee are no more available slots in this column
    return null;
  }
};

// Insert the current pending chip into the columns array at the given index
Game.prototype.placePendingChip = function (args) {
  this.grid.columns[args.column].push(this.pendingChip);
  this.lastPlacedChip = this.pendingChip;
  this.lastPlacedChip.column = args.column;
  this.lastPlacedChip.row = this.grid.columns[args.column].length - 1;
  this.pendingChip = null;
};

// Find same-color neighbors aligned with the given chip in the given direction
Game.prototype.findAlignedNeighbors = function (chip, direction) {
  var neighbor = chip;
  var alignedNeighbors = [];
  while (true) {
    var nextColumn = neighbor.column + direction.x;
    // Stop if the left/right edge of the grid has been reached
    if (this.grid.columns[nextColumn] === undefined) {
      break;
    }
    var nextRow = neighbor.row + direction.y;
    var nextNeighbor = this.grid.columns[nextColumn][nextRow];
    // Stop if the top/bottom edge of the grid has been reached or if the
    // neighboring slot is empty
    if (nextNeighbor === undefined) {
      break;
    }
    // Stop if this neighbor is not the same color as the original chip
    if (nextNeighbor.player !== chip.player) {
      break;
    }
    // Assume at this point that this neighbor chip is aligned with the original
    // chip in the given direction
    neighbor = nextNeighbor;
    alignedNeighbors.push(nextNeighbor);
  }
  return alignedNeighbors;
};
// Determine if a player won the game with four chips in a row (horizontally,
// vertically, or diagonally)
Game.prototype.checkForWinner = function () {
  var game = this;
  _.forEach(Game.connectionDirections, function (direction) {
    var alignedChips = [game.lastPlacedChip];
    // Check for aligned neighbors in this direction
    alignedChips.push.apply(alignedChips, game.findAlignedNeighbors(game.lastPlacedChip, direction));
    // Check for aligned neighbors in the opposite direction
    alignedChips.push.apply(alignedChips, game.findAlignedNeighbors(game.lastPlacedChip, {
      x: -direction.x,
      y: -direction.y
    }));
    // If four aligned same-color chips are found, mark them as highlighted
    if (alignedChips.length === 4) {
      _.forEach(alignedChips, function (neighbor) {
        neighbor.highlighted = true;
      });
      return game.lastPlacedChip.player;
    }
  });
  return null;
};
// The relative directions to check when checking for aligned chip neighbors
Game.connectionDirections = [
  {x: 0, y: -1}, // Bottom-middle
  {x: 1, y: -1}, // Bottom-right
  {x: 1, y: 0}, // Right-middle
  {x: 1, y: 1} // Top-right
];

Game.prototype.resetGame = function (args) {
  this.gameInProgress = false;
  this.players.length = 0;
  this.currentPlayer = null;
  this.pendingChip = null;
  this.lastPlacedChip = null;
  this.grid.resetGrid();
};

Game.Component = {};

Game.Component.controller = function () {
  return {
    game: new Game({
      grid: new Grid({
        columnCount: 7,
        rowCount: 6
      })
    })
  };
};

Game.Component.view = function (ctrl) {
  return [
    m(Dashboard.Component, ctrl.game),
    m(Grid.Component, ctrl.game)
  ];
};

module.exports = Game;

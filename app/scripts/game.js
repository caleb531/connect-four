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

// Find neighbors connected to the given chip in the given direction
Game.prototype.findConnectedNeighbors = function (chip, dir) {
  var neighbor = chip;
  var connectedNeighbors = [];
  var columns = this.grid.columns;
  while (true) {
    var nextColumn = neighbor.column + dir.x;
    // Stop when we hit the first or last column
    if (columns[nextColumn] === undefined) {
      break;
    }
    var nextRow = neighbor.row + dir.y;
    var nextNeighbor = columns[nextColumn][nextRow];
    if (nextNeighbor === undefined) {
      break;
    }
    if (nextNeighbor.player === chip.player) {
      neighbor = nextNeighbor;
      connectedNeighbors.push(nextNeighbor);
    } else {
      break;
    }
  }
  return connectedNeighbors;
};
// Determine if a player won the game with four chips in a row (horizontally,
// vertically, or diagonally)
Game.prototype.checkConnection = function () {
  var game = this;
  _.forEach(Game.connectionDirections, function (dir) {
    var connectedChips = [game.lastPlacedChip];
    // Check for connected neighbors in this direction
    connectedChips.push.apply(connectedChips, game.findConnectedNeighbors(game.lastPlacedChip, dir));
    // Check for connected neighbors in the opposite direction
    connectedChips.push.apply(connectedChips, game.findConnectedNeighbors(game.lastPlacedChip, {
      x: -dir.x,
      y: -dir.y
    }));
    if (connectedChips.length === 4) {
      // Mark connected chips as highlighted
      _.forEach(connectedChips, function (neighbor) {
        neighbor.highlighted = true;
      });
    }
  });
};
// The relative directions to check when checking for connected chip neighbors
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

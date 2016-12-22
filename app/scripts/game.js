'use strict';

var m = require('mithril');
var _ = require('underscore');
var Controls = require('./controls');
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
  // The index of the last column a chip was inserted into
  this.lastInsertedChipColumn = Math.floor(this.grid.columnCount / 2);
  // Whether or not a chip is in the process of being placed on the grid
  this.pendingChipIsFalling = false;
  // The chip that was most recently placed in the board
  this.lastPlacedChip = null;
  // TODO: remove this when P2 mode testing is finished
  this.startGame({playerCount: 2});
}

Game.prototype.startGame = function (args) {
  if (args.playerCount === 2) {
    // If 2-player game is selected, assume two human players
    this.players.push(new Player({color: 'red', playerNum: 1}));
    this.players.push(new Player({color: 'blue', playerNum: 2}));
  } else {
    // Otherwise, assume one human player and one AI player
    this.players.push(new Player({color: 'red', playerNum: 1}));
    // Set color of AI player to black to distinguish it from a human player
    this.players.push(new Player({color: 'black', playerNum: 2, ai: true}));
  }
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
  this.lastInsertedChipColumn = args.column;
  this.pendingChipIsFalling = false;
  this.pendingChip = null;
};

Game.prototype.resetGame = function (args) {
  this.gameInProgress = false;
  this.players.length = 0;
  this.currentPlayer = null;
  this.pendingChip = null;
  this.pendingChipIsFalling = false;
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
    m(Controls.Component, ctrl.game),
    m(Grid.Component, ctrl.game)
  ];
};

module.exports = Game;

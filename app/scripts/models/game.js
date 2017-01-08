'use strict';

var Grid = require('./grid');
var Player = require('./player');
var Chip = require('./chip');

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
    this.players = [
      new Player({color: 'red', name: 'Player 1'}),
      new Player({color: 'blue', name: 'Player 2'})
    ];
  }
  // The current player is null when a game is not in progress
  this.currentPlayer = null;
  // Whether or not the game is in progress
  this.inProgress = false;
  // The chip above the grid that is about to be placed
  this.pendingChip = null;
  // The chip that was most recently placed on the grid
  this.lastPlacedChip = null;
  // The winning player of the game
  this.winner = null;
}

Game.prototype.startGame = function (args) {
  this.currentPlayer = this.players[0];
  this.inProgress = true;
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
};

// Reset the game and grid completely without starting a new game (endGame
// should be called somewhere before this method is called)
Game.prototype.resetGame = function (args) {
  this.lastPlacedChip = null;
  this.winner = null;
  this.grid.resetGrid();
};

// Start the turn of the current player
Game.prototype.startTurn = function () {
  this.pendingChip = new Chip({player: this.currentPlayer});
};

// End the turn of the current player and switch to the next player
Game.prototype.endTurn = function () {
  if (this.inProgress) {
    // Switch to next player's turn
    if (this.currentPlayer === this.players[0]) {
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }
    this.startTurn();
  }
};

// Insert the current pending chip into the columns array at the given index
Game.prototype.placePendingChip = function (args) {
  if (this.pendingChip) {
    this.grid.columns[args.column].push(this.pendingChip);
    this.lastPlacedChip = this.pendingChip;
    this.lastPlacedChip.column = args.column;
    this.lastPlacedChip.row = this.grid.columns[args.column].length - 1;
    this.pendingChip = null;
    // Check for winning connections (i.e. four in a row)
    this.checkForWin();
    // Check if the grid is completely full
    this.checkForFullGrid();
    // If the above checks have not ended the game, continue to next player's
    // turn
    this.endTurn();
  }
};

// Check if the grid is completely full of chips, and end the game if it is
Game.prototype.checkForFullGrid = function () {
  if (this.grid.checkIfFull()) {
    this.endGame();
  }
};

// Determine if a player won the game with four chips in a row (horizontally,
// vertically, or diagonally)
Game.prototype.checkForWin = function () {
  var connections = this.grid.getConnections(this.lastPlacedChip);
  if (connections.length > 0) {
    // Highlight chips to indicate that they're part of a winning connection
    connections.forEach(function (connection) {
      connection.forEach(function (chip) {
        chip.highlighted = true;
      });
    });
    this.winner = this.lastPlacedChip.player;
    this.endGame();
  }
};

module.exports = Game;

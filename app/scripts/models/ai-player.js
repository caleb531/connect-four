'use strict';

var Player = require('./player');

// An AI player that can think for itself
function AIPlayer(args) {
  Player.call(this, args);
}
AIPlayer.prototype = Object.create(Player.prototype);
AIPlayer.prototype.type = 'AI';
// The duration to wait (in ms) for the user to process the AI player's actions
AIPlayer.waitDelay = 100;

// Wait for a short moment to give the user time to see and process the AI
// player's actions
AIPlayer.prototype.wait = function (callback) {
  setTimeout(function () {
    callback();
  }, AIPlayer.waitDelay);
};

// Compute the column where the AI player should place its next chip
AIPlayer.prototype.computeNextMove = function (game) {
  var chosenColumn = Math.floor(game.grid.columnCount * Math.random());
  this.wait(function () {
    game.emitter.emit('ai-player:compute-next-move', chosenColumn);
  });
};

module.exports = AIPlayer;

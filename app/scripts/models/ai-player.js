'use strict';

var Player = require('./player');

// An AI player that can think for itself
function AIPlayer(args) {
  Player.call(this, args);
}
AIPlayer.prototype = Object.create(Player.prototype);
AIPlayer.prototype.type = 'AI';

AIPlayer.prototype.getNextMove = function (game, callback) {

  callback(Math.floor(game.grid.columnCount * Math.random()));

};

module.exports = AIPlayer;

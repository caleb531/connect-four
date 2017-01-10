'use strict';

var Player = require('./player');

// An AI player that can think for itself
function AIPlayer(args) {
  Player.call(this, args);
}
AIPlayer.prototype = Object.create(Player.prototype);
AIPlayer.prototype.type = 'AI';

AIPlayer.prototype.computeNextMove = function (game) {
  var chosenColumn = Math.floor(game.grid.columnCount * Math.random());
  game.emitter.emit('ai-player:compute-next-move', chosenColumn);
};

module.exports = AIPlayer;

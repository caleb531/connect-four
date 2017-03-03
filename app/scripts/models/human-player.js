'use strict';

var Player = require('./player');

// A human player that requires user interaction; every human player inherits
// from the base Player model
function HumanPlayer(args) {
  Player.call(this, args);
}
HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.type = 'human';

module.exports = HumanPlayer;

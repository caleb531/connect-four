'use strict';

var Player = require('./player');

// A human player which requires user interaction
function HumanPlayer(args) {
  Player.call(this, args);
}
HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.type = 'human';

module.exports = HumanPlayer;

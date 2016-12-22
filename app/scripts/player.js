'use strict';

function Player(args) {
  this.playerNum = args.playerNum;
  this.color = args.color;
  this.ai = !!args.ai;
}

module.exports = Player;

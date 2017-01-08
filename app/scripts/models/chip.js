'use strict';

function Chip(args) {
  // A reference to the player who placed this chip
  this.player = args.player;
  // The index of the column on the grid where this chip was placed
  this.column = null;
  // The index of the row on the grid where this chip was placed
  this.row = null;
  // Whether or not the chip should be visually highlighted to indicate if the
  // chip is part of a winning connection
  this.highlighted = false;
}

module.exports = Chip;

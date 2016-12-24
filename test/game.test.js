'use strict';

var expect = require('chai').expect;
var Grid = require('../app/scripts/grid');
var Game = require('../app/scripts/game');

describe('Game', function () {

  it('should determine a winner', function () {
    var game = new Game();
    game.startGame();
    game.placePendingChip({column: 0}); // P1

    // Winners haven't won until they've won.
    expect(game.winner).to.be.null;

    // Play an extremely skillful game.
    game.placePendingChip({column: 1}); // P2
    game.placePendingChip({column: 0}); // P1
    game.placePendingChip({column: 1}); // P2
    game.placePendingChip({column: 0}); // P1
    game.placePendingChip({column: 1}); // P2
    game.placePendingChip({column: 0}); // P1

    expect(game.winner).not.to.be.null;
    expect(game.winner).to.have.property('name', 'Player 1');
  });

});

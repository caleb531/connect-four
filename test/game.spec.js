'use strict';

var expect = require('chai').expect;
var Grid = require('../app/scripts/grid');
var Player = require('../app/scripts/player');
var Game = require('../app/scripts/game');

describe('Game', function () {

  it('should initialize game with no arguments', function () {
    var game = new Game();
    expect(game.grid.columnCount).to.equal(7);
    expect(game.grid.rowCount).to.equal(6);
    expect(game.players.length).to.equal(2);
    expect(game.currentPlayer).to.be.null;
    expect(game.pendingChip).to.be.null;
    expect(game.lastPlacedChip).to.be.null;
    expect(game.winner).to.be.null;
  });

  it('should initialize game with arguments', function () {
    var game = new Game({
      players: [
        new Player({color: 'blue', name: 'Bob'}),
        new Player({color: 'black', name: 'Larry'})
      ],
      grid: new Grid({columnCount: 9, rowCount: 8})
    });
    expect(game.grid.columnCount).to.equal(9);
    expect(game.grid.rowCount).to.equal(8);
    expect(game.players.length).to.equal(2);
    expect(game.players[0].name).to.equal('Bob');
    expect(game.players[1].name).to.equal('Larry');
    expect(game.currentPlayer).to.be.null;
    expect(game.pendingChip).to.be.null;
    expect(game.lastPlacedChip).to.be.null;
    expect(game.winner).to.be.null;
  });

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

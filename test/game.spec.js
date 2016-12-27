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

  it('should start game', function () {
    var game = new Game();
    game.startGame();
    expect(game.currentPlayer).to.equal(game.players[0]);
    expect(game.inProgress).to.be.true;
  });

  it('should start turn', function () {
    var game = new Game();
    game.startTurn();
    expect(game.pendingChip).not.to.be.null;
  });

  it('should end turn', function () {
    var game = new Game();
    game.startGame();
    game.startTurn();
    game.endTurn();
    expect(game.currentPlayer).to.equal(game.players[1]);
  });

  it('should end game', function () {
    var game = new Game();
    game.startGame();
    game.endGame();
    expect(game.currentPlayer).to.be.null;
    expect(game.inProgress).to.be.false;
    expect(game.pendingChip).to.be.null;
  });

  it('should increment winner\'s score when ending game', function () {
    var game = new Game();
    game.startGame();
    game.winner = game.players[0];
    expect(game.winner.score).to.equal(0);
    game.endGame();
    expect(game.winner.score).to.equal(1);
  });

  it('should reset grid when resetting game', function () {
    var game = new Game();
    game.startGame();
    game.placePendingChip({column: 2});
    expect(game.grid.columns[2]).to.have.length(1);
    game.endGame();
    game.resetGame();
    expect(game.grid.columns[2]).to.have.length(0);
  });

  it('should reset winner when resetting game', function () {
    var game = new Game();
    game.startGame();
    game.placePendingChip({column: 0}); // P1
    game.placePendingChip({column: 1}); // P2
    game.placePendingChip({column: 0}); // P1
    game.placePendingChip({column: 1}); // P2
    game.placePendingChip({column: 0}); // P1
    game.placePendingChip({column: 1}); // P2
    game.placePendingChip({column: 0}); // P1
    expect(game.winner).not.to.be.null;
    game.endGame();
    game.resetGame();
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

'use strict';

var expect = require('chai').expect;
var Grid = require('../app/scripts/models/grid');
var Player = require('../app/scripts/models/player');
var Game = require('../app/scripts/models/game');

describe('game', function () {

  // Place chips at the given columns in the given order
  function placeChips(args) {
    args.columns.forEach(function (column) {
      args.game.placePendingChip({column: column});
    });
  }

  it('should initialize with no arguments', function () {
    var game = new Game();
    expect(game).to.have.property('grid');
    expect(game.grid).to.have.property('columnCount', 7);
    expect(game.grid).to.have.property('rowCount', 6);
    expect(game).to.have.property('players');
    expect(game.players).to.have.length(0);
    expect(game).to.have.property('currentPlayer', null);
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('pendingChip', null);
    expect(game).to.have.property('lastPlacedChip', null);
    expect(game).to.have.property('winner', null);
  });

  it('should initialize with arguments', function () {
    var game = new Game({
      players: [
        new Player({color: 'blue', name: 'Bob'}),
        new Player({color: 'black', name: 'Larry'})
      ],
      grid: new Grid({columnCount: 9, rowCount: 8})
    });
    expect(game.grid).to.have.property('columnCount', 9);
    expect(game.grid).to.have.property('rowCount', 8);
    expect(game.players).to.have.length(2);
    expect(game.players[0].name).to.equal('Bob');
    expect(game.players[1].name).to.equal('Larry');
    expect(game).to.have.property('currentPlayer', null);
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('pendingChip', null);
    expect(game).to.have.property('lastPlacedChip', null);
    expect(game).to.have.property('winner', null);
  });

  it('should initialize 1P game', function () {
    var game = new Game();
    game.setPlayers(1);
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[1].type).to.equal('ai');
  });

  it('should initialize 2P game', function () {
    var game = new Game();
    game.setPlayers(2);
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[1].type).to.equal('human');
  });

  it('should preserve players when continuing in 1P mode', function () {
    var game = new Game();
    game.setPlayers(1);
    game.players[0].score = 10;
    game.players[1].score = 20;
    game.setPlayers(1);
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(10);
    expect(game.players[1].type).to.equal('ai');
    expect(game.players[1].score).to.equal(20);
  });

  it('should preserve players when continuing in 2P mode', function () {
    var game = new Game();
    game.setPlayers(2);
    game.players[0].score = 12;
    game.players[1].score = 16;
    game.setPlayers(2);
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(12);
    expect(game.players[1].type).to.equal('human');
    expect(game.players[1].score).to.equal(16);
  });

  it('should initialize new players when switching from 1P to 2P', function () {
    var game = new Game();
    game.setPlayers(1);
    game.players[0].score = 10;
    game.players[1].score = 15;
    game.setPlayers(2);
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].type).to.equal('human');
    expect(game.players[1].score).to.equal(0);
  });

  it('should initialize new players when switching from 2P to 1P', function () {
    var game = new Game();
    game.setPlayers(2);
    game.players[0].score = 10;
    game.players[1].score = 15;
    game.setPlayers(1);
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].type).to.equal('ai');
    expect(game.players[1].score).to.equal(0);
  });

  it('should start', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    expect(game.currentPlayer).to.equal(game.players[0]);
    expect(game.inProgress).to.be.true;
  });

  it('should set starting player when starting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame({
      startingPlayer: game.players[1]
    });
    expect(game.currentPlayer).to.equal(game.players[1]);
    expect(game.inProgress).to.be.true;
  });

  it('should start turn', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.startTurn();
    expect(game.pendingChip).not.to.be.null;
  });

  it('should end turn', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.startTurn();
    game.endTurn();
    expect(game.currentPlayer).to.equal(game.players[1]);
  });

  it('should end', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.endGame();
    expect(game.currentPlayer).to.be.null;
    expect(game.inProgress).to.be.false;
    expect(game.pendingChip).to.be.null;
  });

  it('should increment winner\'s score when ending', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.winner = game.players[0];
    expect(game.winner.score).to.equal(0);
    game.endGame();
    expect(game.winner.score).to.equal(1);
  });

  it('should reset grid when resetting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.placePendingChip({column: 2});
    expect(game.grid.columns[2]).to.have.length(1);
    game.endGame();
    game.resetGame();
    expect(game.grid.columns[2]).to.have.length(0);
  });

  it('should reset winner when resetting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.winner = game.players[0];
    game.endGame();
    game.resetGame();
    expect(game.winner).to.be.null;
  });

  it('should reset pending chip when resetting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    expect(game.pendingChip).not.to.be.null;
    game.endGame();
    game.resetGame();
    expect(game.pendingChip).to.be.null;
  });

  it('should win horizontally', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    placeChips({
      game: game,
      columns: [2, 2, 3, 3, 4, 4, 5]
    });
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win vertically', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    placeChips({
      game: game,
      columns: [0, 1, 0, 1, 0, 1, 0]
    });
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win diagonally', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 4, 4, 3, 5, 5, 5, 6, 6, 6, 6]
    });
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win with two connect-fours at once', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    placeChips({
      game: game,
      columns: [0, 1, 1, 1, 2, 2, 2, 0, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3]
    });
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win on connections of more than four', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    placeChips({
      game: game,
      columns: [2, 2, 3, 3, 4, 4, 6, 6, 5]
    });
    expect(game.winner).not.to.be.null;
  });

  it('should end when grid becomes full', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    placeChips({
      game: game,
      columns: [
        0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
        2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2,
        4, 5, 4, 5, 4, 5, 5, 4, 5, 4, 5, 4,
        6, 6, 6, 6, 6, 6
      ]
    });
    expect(game.winner).to.be.null;
    expect(game.inProgress).to.be.false;
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].score).to.equal(0);
  });

});

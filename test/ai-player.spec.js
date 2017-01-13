'use strict';

var expect = require('chai').expect;
var AIPlayer = require('../app/scripts/models/ai-player');
var Game = require('../app/scripts/models/game');
var Chip = require('../app/scripts/models/chip');

describe('AI player', function () {

  // Place chips at the given columns with the given players
  function placeChips(args) {
    var currentPlayer = args.game.players[0];
    args.columns.forEach(function (column) {
      var chip = new Chip({player: currentPlayer});
      args.game.grid.placeChip({column: column, chip: chip});
      if (currentPlayer == args.game.players[0]) {
        currentPlayer = args.game.players[1];
      } else {
        currentPlayer = args.game.players[0];
      }
    });
  }

  it('should initialize', function () {
    var aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    expect(aiPlayer).to.have.property('name', 'HAL');
    expect(aiPlayer).to.have.property('color', 'red');
    expect(aiPlayer).to.have.property('score', 0);
    expect(aiPlayer).to.have.property('type', 'ai');
  });

  it('should block horizontal opponent win', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 2, 5, 2, 6]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(4);
  });

  it('should block horizontal connect-three trap (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 3, 5]
    });
    expect(game.players[1].computeNextMove(game)).to.be.oneOf([2, 4, 6]);
  });

  it('should block horizontal connect-three trap (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 1, 3, 3, 5]
    });
    expect(game.players[1].computeNextMove(game)).to.be.oneOf([2, 4, 6]);
  });

  it('should block horizontal connect-three trap (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 1, 3, 3, 4]
    });
    expect(game.players[1].computeNextMove(game)).to.be.oneOf([2, 5, 6]);
  });

  it('should block vertical opponent win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 2, 3, 2, 3]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(3);
  });

  it('should block vertical opponent win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [2, 0, 4, 3, 3, 0, 4, 0, 0, 2, 4]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(4);
  });

  it('should block diagonal opponent win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [4, 3, 3, 2, 1, 2, 2, 1, 1]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(1);
  });

  it('should block diagonal opponent win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [2, 3, 3, 5, 5, 5, 4, 4, 4]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(5);
  });

  it('should block diagonal opponent win (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [2, 0, 3, 1, 4, 5, 1, 0, 2, 4, 3, 0, 5, 1, 3, 2, 4, 2, 0, 3, 1, 0, 3, 2, 2, 3, 4]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(5);
  });

  it('should block one win of opponent double-win', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 0, 2, 1, 3, 0, 3, 3, 0, 0, 2, 1, 2]
    });
    expect(game.players[1].computeNextMove(game)).to.be.oneOf([1, 2]);
  });

  it('should win horizontally on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [1, 2, 1, 3, 1, 1, 2, 4, 2]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(5);
  });

  it('should win vertically on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [3, 2, 3, 2, 5, 2, 4]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(2);
  });

  it('should win diagonally on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    game.startGame();
    placeChips({
      game: game,
      columns: [1, 2, 3, 3, 2, 4, 4, 4, 5, 5, 5]
    });
    expect(game.players[1].computeNextMove(game)).to.equal(5);
  });

});

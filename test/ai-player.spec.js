'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var AIPlayer = require('../app/scripts/models/ai-player');
var Game = require('../app/scripts/models/game');
var Chip = require('../app/scripts/models/chip');

describe('AI player', function () {

  // Place chips at the given columns with the given players
  function placeChips(args) {
    var currentPlayer;
    if (args && args.startingPlayer) {
      currentPlayer = args.startingPlayer;
    } else {
      currentPlayer = args.game.players[0];
    }
    args.columns.forEach(function (column) {
      var chip = new Chip({player: currentPlayer});
      args.game.grid.placeChip({column: column, chip: chip});
      if (currentPlayer === args.game.players[0]) {
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

  it('should wait when instructed', function () {
    var aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    var clock = sinon.useFakeTimers();
    var callback = sinon.spy();
    expect(aiPlayer.wait(callback));
    clock.tick(500);
    expect(callback).to.have.been.calledOnce;
    clock.restore();
  });

  it('should block horizontal opponent win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 2, 5, 2, 6]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(4);
  });

  it('should block horizontal opponent win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [1, 0, 4, 2, 5, 3, 6, 0, 2, 2, 1, 0, 0, 0, 3]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(4);
  });

  it('should block horizontal opponent win (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [2, 0, 4, 1, 6, 3, 2, 0, 3, 1, 4, 5, 0, 3, 0, 3, 2, 2, 4, 4, 2, 6, 6, 4, 3, 4, 2, 3, 6]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block horizontal connect-three trap (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 3, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([2, 4, 6]);
  });

  it('should block horizontal connect-three trap (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 1, 3, 3, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([2, 4, 6]);
  });

  it('should block horizontal connect-three trap (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 1, 3, 3, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([2, 5, 6]);
  });

  it('should block horizontal connect-three trap (#4)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 3, 1]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 2, 4]);
  });

  it('should block vertical opponent win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 2, 3, 2, 3]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(3);
  });

  it('should block vertical opponent win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [2, 0, 4, 3, 3, 0, 4, 0, 0, 2, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(4);
  });

  it('should block vertical opponent win (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [0, 3, 4, 4, 5, 4, 5, 4, 5, 5, 4, 5, 3, 3, 3, 3, 3, 4, 0, 5, 0]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(0);
  });

  it('should block vertical opponent win (#4)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [2, 3, 4, 3, 3, 3, 1, 2, 4, 5, 2, 4, 0, 2, 0, 3, 0, 0, 5, 0, 5, 0, 5]
    });
    game.players[1].debug = true;
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block diagonal opponent win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [4, 3, 3, 2, 1, 2, 2, 1, 1]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(1);
  });

  it('should block diagonal opponent win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [2, 3, 3, 5, 5, 5, 4, 4, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block diagonal opponent win (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [2, 0, 3, 1, 4, 5, 1, 0, 2, 4, 3, 0, 5, 1, 3, 2, 4, 2, 0, 3, 1, 0, 3, 2, 2, 3, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block one win of opponent double-win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 0, 2, 1, 3, 0, 3, 3, 0, 0, 2, 1, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([1, 2]);
  });

  it('should block one win of opponent double-win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [1, 0, 4, 2, 5, 3, 6, 0, 2, 2, 3, 0, 0, 0, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([1, 5]);
  });

  it('should block one win of opponent double-win (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [0, 3, 1, 3, 3, 3, 2, 5, 4, 5, 4, 5, 4, 4, 5, 5, 2, 4, 1, 3, 0, 4, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([1, 2]);
  });

  it('should win horizontally on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [1, 2, 1, 3, 1, 1, 2, 4, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should win vertically on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [3, 2, 3, 2, 5, 2, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(2);
  });

  it('should win diagonally on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      columns: [1, 2, 3, 3, 2, 4, 4, 4, 5, 5, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should wrap around if right side of grid is full', function () {
    var game = new Game();
    game.setPlayers(1);
    placeChips({
      game: game,
      startingPlayer: game.players[1],
      columns: [3, 4, 3, 3, 3, 4, 5, 1, 3, 4, 4, 1, 1, 1, 1, 4, 3, 5, 5, 0, 4, 5, 5, 1, 5, 2, 6, 6, 6, 6, 6, 6]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 2]);
  });

});

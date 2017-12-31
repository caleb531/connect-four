var chai = require('chai');
var expect = chai.expect;

var Grid = require('../../app/scripts/models/grid');
var Player = require('../../app/scripts/models/player');
var Game = require('../../app/scripts/models/game');

describe('game', function () {

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
    expect(game).to.have.property('winner', null);
  });

  it('should initialize debug mode when set', function () {
    var game = new Game({debug: true});
    expect(game).to.have.property('debug', true);
    expect(game).to.have.property('columnHistory');
    expect(game.columnHistory).to.be.an('array');
    expect(game.columnHistory).to.have.length(0);
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

});

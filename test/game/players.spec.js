import chai from 'chai';
var expect = chai.expect;

import Game from '../../app/scripts/models/game';

describe('game', function () {

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

  it('should get other player', function () {
    var game = new Game();
    game.setPlayers(2);
    expect(game.getOtherPlayer(game.players[0])).to.equal(game.players[1]);
    expect(game.getOtherPlayer(game.players[1])).to.equal(game.players[0]);
  });

});

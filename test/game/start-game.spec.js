var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var Emitter = require('tiny-emitter');
var Game = require('../../app/scripts/models/game');

describe('game', function () {

  it('should start', function () {
    var game = new Game();
    game.setPlayers(2);
    sinon.spy(Emitter.prototype, 'emit');
    try {
      game.startGame();
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:start');
    } finally {
      Emitter.prototype.emit.restore();
    }
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

});

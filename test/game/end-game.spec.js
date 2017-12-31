var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var Emitter = require('tiny-emitter');
var Game = require('../../app/scripts/models/game');

describe('game', function () {

  it('should end', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      game.endGame();
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:end');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.currentPlayer).to.be.null;
    expect(game.inProgress).to.be.false;
    expect(game.pendingChip).to.be.null;
  });

  it('should reset debug mode when ended', function () {
   var game = new Game({debug: true});
   game.setPlayers(2);
   game.startGame();
   sinon.stub(console, 'log');
   try {
     game.placePendingChip({column: 2});
     expect(game.columnHistory).to.have.length(1);
     expect(game.columnHistory[0]).to.equal(2);
   } finally {
      // eslint-disable-next-line no-console
     console.log.restore();
   }
   game.endGame();
   expect(game.columnHistory).to.have.length(0);
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

});

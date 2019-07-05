import Emitter from 'tiny-emitter';
import Game from '../../app/scripts/models/game.js';

describe('game', function () {

  it('should start', function () {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
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
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame({
      startingPlayer: game.players[1]
    });
    expect(game.currentPlayer).to.equal(game.players[1]);
    expect(game.inProgress).to.be.true;
  });

});

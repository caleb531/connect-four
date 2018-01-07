import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import Emitter from 'tiny-emitter';
import Game from '../../app/scripts/models/game.js';

describe('game', () => {

  it('should start', () => {
    let game = new Game();
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

  it('should set starting player when starting', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame({
      startingPlayer: game.players[1]
    });
    expect(game.currentPlayer).to.equal(game.players[1]);
    expect(game.inProgress).to.be.true;
  });

});

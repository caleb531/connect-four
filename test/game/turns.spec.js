import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import Game from '../../app/scripts/models/game.js';

describe('game', function () {

  it('should start turn', function () {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.startTurn();
    expect(game.pendingChip).not.to.be.null;
  });

  it('should communicate with AI player on its turn', function () {
    let game = new Game();
    game.setPlayers(1);
    let eventEmitted = false;
    sinon.spy(game.players[1], 'computeNextMove');
    try {
      // Events are emitted and callbacks and run synchronously
      game.on('ai-player:compute-next-move', function (aiPlayer, bestMove) {
        eventEmitted = true;
        expect(aiPlayer).to.equal(game.players[1]);
        expect(bestMove).to.have.property('column');
        expect(bestMove).to.have.property('score');
      });
      game.startGame({
        startingPlayer: game.players[1]
      });
      expect(game.players[1].computeNextMove).to.have.been.calledWith(game);
      expect(game.players[1].computeNextMove).to.have.been.calledWith(game);
    } finally {
      game.players[1].computeNextMove.restore();
    }
    // Emitter event callbacks should have run at this point
    expect(eventEmitted, 'ai-player:compute-next-move not emitted').to.be.true;
  });

  it('should end turn', function () {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.startTurn();
    game.endTurn();
    expect(game.currentPlayer).to.equal(game.players[1]);
  });

});

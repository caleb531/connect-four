import Game from '../../app/scripts/models/game.js';

describe('game', function () {

  it('should start turn', function () {
    let game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.startTurn();
    expect(game.pendingChip).not.to.be.null;
  });

  it('should communicate with AI player on its turn', function (done) {
    let game = new Game();
    game.setPlayers({ gameType: '1P' });
    let eventEmitted = false;
    sinon.spy(game.players[1], 'getNextMove');
    try {
      // Events are emitted and callbacks and run synchronously
      game.on('async-player:get-next-move', ({ aiPlayer, bestMove }) => {
        eventEmitted = true;
        expect(aiPlayer).to.equal(game.players[1]);
        expect(bestMove).to.have.property('column');
        expect(bestMove).to.have.property('score');
      });
      game.startGame({
        startingPlayer: game.players[1]
      });
      expect(game.players[1].getNextMove).to.have.been.calledWith({ game });
      expect(game.players[1].getNextMove).to.have.been.calledWith({ game });
    } finally {
      game.players[1].getNextMove.restore();
    }
    setTimeout(function () {
      // Emitter event callbacks should have run at this point
      expect(eventEmitted, 'async-player:get-next-move not emitted').to.be.true;
      done();
    }, 100);
  });

  it('should end turn', function () {
    let game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.startTurn();
    game.endTurn();
    expect(game.currentPlayer).to.equal(game.players[1]);
  });

});

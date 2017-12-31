import chai from 'chai';
var expect = chai.expect;

import Game from '../../app/scripts/models/game';

describe('game', function () {

  it('should reset grid when resetting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.placePendingChip({column: 2});
    expect(game.grid.columns[2]).to.have.length(1);
    game.endGame();
    game.resetGame();
    expect(game.grid.columns[2]).to.have.length(0);
  });

  it('should reset winner when resetting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.winner = game.players[0];
    game.endGame();
    game.resetGame();
    expect(game.winner).to.be.null;
  });

  it('should reset pending chip when resetting', function () {
    var game = new Game();
    game.setPlayers(2);
    game.startGame();
    expect(game.pendingChip).not.to.be.null;
    game.endGame();
    game.resetGame();
    expect(game.pendingChip).to.be.null;
  });

});

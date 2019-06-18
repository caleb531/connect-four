import Game from '../../app/scripts/models/game.js';

describe('game', function () {

  it('should reset grid when resetting', function () {
    let game = new Game();
    game.setPlayers('2P');
    game.startGame();
    game.placePendingChip({ column: 2 });
    expect(game.grid.columns[2]).to.have.length(1);
    game.endGame();
    game.resetGame();
    expect(game.grid.columns[2]).to.have.length(0);
  });

  it('should reset winner when resetting', function () {
    let game = new Game();
    game.setPlayers('2P');
    game.startGame();
    game.winner = game.players[0];
    game.endGame();
    game.resetGame();
    expect(game.winner).to.be.null;
  });

  it('should reset pending chip when resetting', function () {
    let game = new Game();
    game.setPlayers('2P');
    game.startGame();
    expect(game.pendingChip).not.to.be.null;
    game.endGame();
    game.resetGame();
    expect(game.pendingChip).to.be.null;
  });

});

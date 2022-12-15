import { test, expect } from '@playwright/test';
import Game from '../../app/scripts/models/game.js';

test.describe('game', async () => {

  test('should reset grid when resetting', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.placePendingChip({ column: 2 });
    expect(game.grid.columns[2]).to.have.length(1);
    game.endGame();
    game.resetGame();
    expect(game.grid.columns[2]).to.have.length(0);
  });

  test('should reset winner when resetting', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.winner = game.players[0];
    game.endGame();
    game.resetGame();
    expect(game.winner).to.be.null;
  });

  test('should reset pending chip when resetting', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    expect(game.pendingChip).not.to.be.null;
    game.endGame();
    game.resetGame();
    expect(game.pendingChip).to.be.null;
  });

});

import { test, expect } from '@playwright/test';
import sinon from 'sinon';
import Emitter from 'tiny-emitter';
import Game from '../../scripts/models/game.js';

test.describe('game', async () => {
  test('should end', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      game.endGame();
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:end');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.currentPlayer).toBe(null);
    expect(game.inProgress).toBe(false);
    expect(game.pendingChip).toBe(null);
  });

  test('should reset debug mode when ended', async () => {
    const game = new Game({ debug: true });
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.stub(console, 'log');
    try {
      game.placePendingChip({ column: 2 });
      expect(game.columnHistory).toHaveLength(1);
      expect(game.columnHistory[0]).toEqual(2);
    } finally {
      // eslint-disable-next-line no-console
      console.log.restore();
    }
    game.endGame();
    expect(game.columnHistory).toHaveLength(0);
  });
});

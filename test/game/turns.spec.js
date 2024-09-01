import { test, expect } from '@playwright/test';
import sinon from 'sinon';
import Game from '../../scripts/models/game.js';

test.describe('game', async () => {
  test('should start turn', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.startTurn();
    expect(game.pendingChip).not.toBe(null);
  });

  test('should communicate with AI player on its turn', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    let eventEmitted = false;
    sinon.spy(game.players[1], 'getNextMove');
    try {
      // Events are emitted and callbacks and run synchronously
      game.on('async-player:get-next-move', ({ player, nextMove }) => {
        eventEmitted = true;
        expect(player).toEqual(game.players[1]);
        expect(nextMove).toHaveProperty('column');
        expect(nextMove).toHaveProperty('score');
      });
      game.startGame({
        startingPlayer: game.players[1]
      });
      expect(game.players[1].getNextMove).toHaveBeenCalledWith({ game });
      expect(game.players[1].getNextMove).toHaveBeenCalledWith({ game });
    } finally {
      game.players[1].getNextMove.restore();
    }
    await new Promise((resolve) => {
      setTimeout(() => {
        // Emitter event callbacks should have run at this point
        expect(eventEmitted, 'async-player:get-next-move not emitted').toBe(true);
        resolve();
      }, 100);
    });
  });

  test('should end turn', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.startTurn();
    game.endTurn();
    expect(game.currentPlayer).toEqual(game.players[1]);
  });
});

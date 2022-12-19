import { test, expect } from '@playwright/test';
import sinon from 'sinon';
import Emitter from 'tiny-emitter';
import Game from '../../scripts/models/game.js';

test.describe('game', async () => {

  test('should start', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    sinon.spy(Emitter.prototype, 'emit');
    try {
      game.startGame();
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:start');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.currentPlayer).toEqual(game.players[0]);
    expect(game.inProgress).toBe(true);
  });

  test('should set starting player when starting', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame({
      startingPlayer: game.players[1]
    });
    expect(game.currentPlayer).toEqual(game.players[1]);
    expect(game.inProgress).toBe(true);
  });

});

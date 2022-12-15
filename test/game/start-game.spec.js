import { test, expect } from '@playwright/test';
import Emitter from 'tiny-emitter';
import Game from '../../app/scripts/models/game.js';

test.describe('game', async () => {

  test('should start', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    sinon.spy(Emitter.prototype, 'emit');
    try {
      game.startGame();
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:start');
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

import { test, expect } from '@playwright/test';
import sinon from 'sinon';
import utils from './utils.js';

import AIPlayer from '../../scripts/models/ai-player.js';
import Game from '../../scripts/models/game.js';

test.describe('AI player', async () => {

  test('should initialize', async () => {
    const aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    expect(aiPlayer).toHaveProperty('name', 'HAL');
    expect(aiPlayer).toHaveProperty('color', 'red');
    expect(aiPlayer).toHaveProperty('score', 0);
    expect(aiPlayer).toHaveProperty('type', 'ai');
  });

  test('should wait when instructed', async () => {
    const aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    const clock = sinon.useFakeTimers();
    const callback = sinon.spy();
    aiPlayer.wait(callback);
    expect(callback).not.toHaveBeenCalledOnce();
    clock.tick(500);
    expect(callback).toHaveBeenCalledOnce();
    clock.restore();
  });

  test('should wrap around if right side of grid is full', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      startingPlayer: game.players[1],
      columns: [3, 4, 3, 3, 3, 4, 5, 1, 3, 4, 4, 1, 1, 1, 1, 4, 3, 5, 5, 0, 4, 5, 5, 1, 5, 2, 6, 6, 6, 6, 6, 6]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([0, 2]);
    });
  });

});

import { test, expect } from '@playwright/test';
import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

test.describe('AI player', async () => {

  test('should block diagonal opponent win (#1)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [4, 3, 3, 2, 1, 2, 2, 1, 1]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(1);
    });
  });

  test('should block diagonal opponent win (#2)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [2, 3, 3, 5, 5, 5, 4, 4, 4]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

});

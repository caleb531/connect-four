import { test, expect } from '@playwright/test';
import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

test.describe('AI player', async () => {

  test('should avoid losing move (#1)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        3, 6, 4, 1, 1, 4, 3, 3, 1, 1,
        3, 0, 0, 3, 0, 0, 2, 2, 2, 5,
        2, 4, 4, 4, 5, 0, 2, 2, 4, 6,
        6, 6, 6, 6, 3
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([0, 1]);
    });
  });

  test('should avoid losing move (#2)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        3, 6, 0, 5, 3, 3, 0, 4, 6, 3,
        6, 1, 1, 4, 1, 3, 3, 1, 4, 1,
        4, 4, 5, 1, 5, 5, 5, 4, 5, 6,
        6, 6, 0, 0, 0
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(0);
    });
  });

  test('should avoid losing move (#3)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        3, 2, 6, 4, 6, 5, 5, 6, 6, 4,
        4, 5, 5, 3, 5, 4, 4, 4, 2, 5,
        2, 6, 6
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([0, 1, 2]);
    });
  });

  test('should avoid losing move (#4)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        3, 2, 6, 4, 3, 2, 5, 4, 5, 6,
        4, 5, 5, 5, 4, 4, 6
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([0, 1, 2, 3, 4, 5]);
    });
  });

});

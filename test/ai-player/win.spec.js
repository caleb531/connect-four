import { test, expect } from '@playwright/test';
import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

test.describe('AI player', async () => {

  test('should win horizontally on turn', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [1, 2, 1, 3, 1, 1, 2, 4, 2]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

  test('should win vertically on turn', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 2, 3, 2, 5, 2, 4]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(2);
    });
  });

  test('should win diagonally on turn', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [1, 2, 3, 3, 2, 4, 4, 4, 5, 5, 5]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

});

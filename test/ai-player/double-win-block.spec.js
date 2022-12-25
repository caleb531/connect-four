import { test, expect } from '@playwright/test';
import utils from './utils.js';

import Game from '../../scripts/models/game.js';

test.describe('AI player', async () => {
  test('should block one win of opponent double-win (#1)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 0, 2, 1, 3, 0, 3, 3, 0, 0, 2, 1, 2]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([1, 2]);
    });
  });

  test('should block one win of opponent double-win (#2)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [1, 0, 4, 2, 5, 3, 6, 0, 2, 2, 3, 0, 0, 0, 4]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([1, 5]);
    });
  });

  test('should block one win of opponent double-win (#3)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        0, 3, 1, 3, 3, 3, 2, 5, 4, 5, 4, 5, 4, 4, 5, 5, 2, 4, 1, 3, 0, 4, 2
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([1, 2]);
    });
  });

  test('should block one win of opponent double-win (#4)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 2, 2, 1, 3, 3, 1, 1, 2, 2, 0]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toBeOneOf([0, 3]);
    });
  });

  test('should block one win of opponent double-win (#5)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 2, 2, 1, 3, 3, 1, 1, 2, 2, 3]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(0);
    });
  });

  test('should block one win of opponent double-win (#6)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        2, 1, 3, 4, 3, 2, 3, 3, 2, 2, 1, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2,
        3, 3, 0, 5, 5
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

  test('should block one win of opponent double-win (#7)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        3, 2, 3, 4, 2, 4, 3, 3, 2, 2, 4, 1, 1, 1, 4, 4, 6, 1, 3, 2, 1, 2, 6, 5,
        6, 6, 6, 6, 5
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

  test('should block one win of opponent double-win (#8)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        2, 0, 3, 1, 4, 5, 1, 0, 2, 4, 3, 0, 5, 1, 3, 2, 4, 2, 0, 3, 1, 0, 3, 2,
        2, 3, 4
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

  test('should block one win of opponent double-win (#9)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 2, 2, 1, 3, 3, 1, 1, 2, 2, 1]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(4);
    });
  });

  test('should block one win of opponent double-win (#10)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [
        3, 3, 0, 0, 1, 2, 2, 2, 3, 1, 1, 2, 1, 1, 3, 2, 2, 3, 6, 5, 5, 1, 4, 5,
        6, 6, 5, 3, 5, 5, 4
      ]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(4);
    });
  });

  test('should block one win of opponent double-win (#11)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [1, 4, 1, 4, 2, 5, 2, 6, 3, 5, 3]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(0);
    });
  });
});

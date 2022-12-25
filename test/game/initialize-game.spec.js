import { test, expect } from '@playwright/test';
import Grid from '../../scripts/models/grid.js';
import Player from '../../scripts/models/player.ts';
import Game from '../../scripts/models/game.js';

test.describe('game', async () => {
  test('should initialize with no arguments', async () => {
    const game = new Game();
    expect(game).toHaveProperty('grid');
    expect(game.grid).toHaveProperty('columnCount', 7);
    expect(game.grid).toHaveProperty('rowCount', 6);
    expect(game).toHaveProperty('players');
    expect(game.players).toHaveLength(0);
    expect(game).toHaveProperty('currentPlayer', null);
    expect(game).toHaveProperty('inProgress', false);
    expect(game).toHaveProperty('pendingChip', null);
    expect(game).toHaveProperty('winner', null);
  });

  test('should initialize with arguments', async () => {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ],
      grid: new Grid({ columnCount: 9, rowCount: 8 })
    });
    expect(game.grid).toHaveProperty('columnCount', 9);
    expect(game.grid).toHaveProperty('rowCount', 8);
    expect(game.players).toHaveLength(2);
    expect(game.players[0].name).toEqual('Bob');
    expect(game.players[1].name).toEqual('Larry');
    expect(game).toHaveProperty('currentPlayer', null);
    expect(game).toHaveProperty('inProgress', false);
    expect(game).toHaveProperty('pendingChip', null);
    expect(game).toHaveProperty('winner', null);
  });

  test('should initialize debug mode when set', async () => {
    const game = new Game({ debug: true });
    expect(game).toHaveProperty('debug', true);
    expect(game).toHaveProperty('columnHistory');
    expect(game.columnHistory).toBeInstanceOf(Array);
    expect(game.columnHistory).toHaveLength(0);
  });

  test('should initialize 1P game', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[1].type).toEqual('ai');
  });

  test('should initialize 2P game', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[1].type).toEqual('human');
  });
});

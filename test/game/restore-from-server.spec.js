import { test, expect } from '@playwright/test';
import Game from '../../scripts/models/game.js';
import Grid from '../../scripts/models/grid.js';
import HumanPlayer from '../../scripts/models/human-player.js';
import OnlinePlayer from '../../scripts/models/online-player.js';
import Chip from '../../scripts/models/chip.js';

test.describe('game', async () => {
  let session;
  let game;
  let serverGame;
  let localPlayer;

  test.beforeEach(() => {
    session = {
      on: () => {
        /* this is a noop */
      }
    };
    game = new Game({ session });
    serverGame = {
      inProgress: true,
      players: [
        { name: 'Abott', color: 'red' },
        { name: 'Costello', color: 'blue' }
      ],
      currentPlayer: 'blue',
      requestingPlayer: 'red',
      grid: {
        columnCount: 7,
        rowCount: 6,
        columns: [
          [],
          [],
          [],
          [],
          [],
          [
            { column: 5, row: 0, player: 'blue' },
            { column: 5, row: 1, player: 'red' }
          ],
          []
        ],
        lastPlacedChip: { column: 5, row: 1, player: 'red' }
      }
    };
    localPlayer = serverGame.players[0];
  });

  test('should restore basic state from server', async () => {
    game.restoreFromServer({ game: serverGame, localPlayer });
    expect(game.inProgress).toEqual(true);
    expect(game.type).toEqual('online');
  });

  test('should restore player data from server', async () => {
    game.restoreFromServer({ game: serverGame, localPlayer });
    expect(game.players[0]).toBeInstanceOf(HumanPlayer);
    expect(game.players[1]).toBeInstanceOf(OnlinePlayer);
    expect(game.currentPlayer).toEqual(game.players[1]);
    expect(game.requestingPlayer).toEqual(game.players[0]);
  });

  test('should set correct player to online player', async () => {
    localPlayer = serverGame.players[1];
    game.restoreFromServer({ game: serverGame, localPlayer });
    expect(game.players[0]).toBeInstanceOf(OnlinePlayer);
    expect(game.players[1]).toBeInstanceOf(HumanPlayer);
  });

  test('should restore grid data from server', async () => {
    game.restoreFromServer({ game: serverGame, localPlayer });
    expect(game.grid).toBeInstanceOf(Grid);
    expect(game.grid.columns[5][0]).toBeInstanceOf(Chip);
    expect(game.grid.columns[5][0].column).toEqual(5);
    expect(game.grid.columns[5][0].row).toEqual(0);
    expect(game.grid.columns[5][0].player).toEqual(game.players[1]);
    expect(game.grid.columns[5][1]).toBeInstanceOf(Chip);
    expect(game.grid.columns[5][1].column).toEqual(5);
    expect(game.grid.columns[5][1].row).toEqual(1);
    expect(game.grid.columns[5][1].player).toEqual(game.players[0]);
    expect(game.grid.lastPlacedChip).toEqual(game.grid.columns[5][1]);
  });

  test('should restore lastPlacedChip as null if grid is empty', async () => {
    serverGame.grid.lastPlacedChip = null;
    game.restoreFromServer({ game: serverGame, localPlayer });
    expect(game.grid.lastPlacedChip).toBe(null);
  });
});

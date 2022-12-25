import { test, expect } from '@playwright/test';
import Game from '../../server/game.js';
import Grid from '../../server/grid.js';
import Player from '../../server/player.ts';

test.describe('server game', async () => {
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
    expect(game).toHaveProperty('startingPlayer', null);
    expect(game).toHaveProperty('currentPlayer', null);
    expect(game).toHaveProperty('requestingPlayer', null);
    expect(game).toHaveProperty('inProgress', false);
    expect(game).toHaveProperty('pendingChipColumn', null);
    expect(game).toHaveProperty('winner', null);
  });

  test('should initialize with default grid', async () => {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ]
    });
    expect(game.grid).toHaveProperty('columnCount', 7);
    expect(game.grid).toHaveProperty('rowCount', 6);
  });

  test('should start game', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    expect(game).toHaveProperty('startingPlayer', null);
    game.startGame();
    expect(game).toHaveProperty('startingPlayer', players[1]);
    expect(game).toHaveProperty('currentPlayer', players[1]);
    expect(game).toHaveProperty('inProgress', true);
  });

  test('should alternate starting player when starting successive games', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    expect(game).toHaveProperty('startingPlayer', null);
    game.startGame();
    expect(game).toHaveProperty('startingPlayer', players[1]);
    game.endGame();
    game.startGame();
    expect(game).toHaveProperty('startingPlayer', players[0]);
  });

  test('should end game', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.startGame();
    game.endGame();
    expect(game).toHaveProperty('inProgress', false);
    expect(game).toHaveProperty('currentPlayer', null);
  });

  test('should reset game', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.startGame();
    game.winner = players[1];
    game.endGame();
    game.requestingPlayer = players[0];
    game.resetGame();
    expect(game).toHaveProperty('inProgress', false);
    expect(game).toHaveProperty('requestingPlayer', null);
    expect(game).toHaveProperty('winner', null);
  });

  test('should place chip', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.startGame();
    expect(game).toHaveProperty('currentPlayer', players[1]);
    game.placeChip({
      column: 4
    });
    expect(game.grid.columns[4]).toHaveLength(1);
    expect(game.grid.columns[4][0]).toHaveProperty('column', 4);
    expect(game.grid.columns[4][0]).toHaveProperty('player', 'black');
    expect(game).toHaveProperty('currentPlayer', players[0]);
  });

  test('should not place chip if game is not in progress', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.placeChip({
      column: 4
    });
    expect(game.grid.columns[4]).toHaveLength(0);
  });

  test('should declare winner', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    players[0].lastSubmittedWinner = players[0];
    players[1].lastSubmittedWinner = players[0];
    const game = new Game({
      players
    });
    game.startGame();
    game.winner = players[0];
    game.endGame();
    expect(players[0].score).toEqual(0);
    game.declareWinner();
    expect(game.winner).toEqual(players[0]);
    expect(players[0].score).toEqual(1);
  });

  test('should not declare winner if someone spoofs results', async () => {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    players[0].lastSubmittedWinner = players[0];
    players[1].lastSubmittedWinner = players[1];
    const game = new Game({
      players
    });
    game.startGame();
    game.winner = players[0];
    game.endGame();
    expect(players[0].score).toEqual(0);
    game.declareWinner();
    expect(game.winner).toBe(undefined);
    expect(players[0].score).toEqual(0);
    expect(players[1].score).toEqual(0);
  });

  test('should serialize as JSON', async () => {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ],
      grid: new Grid({ columnCount: 9, rowCount: 8 })
    });
    game.currentPlayer = game.players[1];
    game.requestingPlayer = game.players[0];
    const json = game.toJSON();
    expect(json.grid).toHaveProperty('columnCount', 9);
    expect(json.grid).toHaveProperty('rowCount', 8);
    expect(json.players).toHaveLength(2);
    expect(json.players[0].name).toEqual('Bob');
    expect(json.players[1].name).toEqual('Larry');
    expect(json).toHaveProperty('currentPlayer', 'black');
    expect(json).toHaveProperty('requestingPlayer', 'blue');
    expect(json).toHaveProperty('inProgress', false);
    expect(json).toHaveProperty('pendingChipColumn', null);
  });
});

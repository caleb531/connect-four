import { test, expect } from '@playwright/test';
import sinon from 'sinon';
import Emitter from 'tiny-emitter';
import Game from '../../scripts/models/game.js';

test.describe('game', async () => {
  // Place chips at the given columns in the given order
  function placeChips({ game, columns }) {
    columns.forEach((column) => {
      game.placePendingChip({ column });
    });
  }

  test('should place pending chip', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    game.placePendingChip({ column: 2 });
    expect(game.grid.columns[2]).toHaveLength(1);
    expect(game.grid.columns[2][0].player).toEqual(game.players[0]);
  });

  test('should win horizontally', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game,
        columns: [2, 2, 3, 3, 4, 4, 5]
      });
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.toBe(null);
    expect(game.winner.name).toEqual('Human 1');
    expect(game.players[1].score).toEqual(0);
    expect(game.winner.score).toEqual(1);
  });

  test('should win vertically', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game,
        columns: [0, 1, 0, 1, 0, 1, 0]
      });
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.toBe(null);
    expect(game.winner.name).toEqual('Human 1');
    expect(game.players[1].score).toEqual(0);
    expect(game.winner.score).toEqual(1);
  });

  test('should win diagonally', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game,
        columns: [3, 4, 4, 3, 5, 5, 5, 6, 6, 6, 6]
      });
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.toBe(null);
    expect(game.winner.name).toEqual('Human 1');
    expect(game.players[1].score).toEqual(0);
    expect(game.winner.score).toEqual(1);
  });

  test('should win with two connect-fours at once', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game,
        columns: [0, 1, 1, 1, 2, 2, 2, 0, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3]
      });
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.toBe(null);
    expect(game.winner.name).toEqual('Human 1');
    expect(game.players[1].score).toEqual(0);
    expect(game.winner.score).toEqual(1);
  });

  test('should win on connections of more than four', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game,
        columns: [2, 2, 3, 3, 4, 4, 6, 6, 5]
      });
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.toBe(null);
    expect(game.winner.name).toEqual('Human 1');
    expect(game.players[1].score).toEqual(0);
    expect(game.winner.score).toEqual(1);
  });

  test('should end when grid becomes full', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game,
        columns: [
          0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2, 4, 5, 4, 5, 4, 5,
          5, 4, 5, 4, 5, 4, 6, 6, 6, 6, 6, 6
        ]
      });
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:declare-tie');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).toBe(null);
    expect(game.inProgress).toBe(false);
    expect(game.players[0].score).toEqual(0);
    expect(game.players[1].score).toEqual(0);
  });
});

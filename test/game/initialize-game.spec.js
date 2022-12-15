import { test, expect } from '@playwright/test';
import Grid from '../../app/scripts/models/grid.js';
import Player from '../../app/scripts/models/player.js';
import Game from '../../app/scripts/models/game.js';

test.describe('game', async () => {

  test('should initialize with no arguments', async () => {
    const game = new Game();
    expect(game).to.have.property('grid');
    expect(game.grid).to.have.property('columnCount', 7);
    expect(game.grid).to.have.property('rowCount', 6);
    expect(game).to.have.property('players');
    expect(game.players).to.have.length(0);
    expect(game).to.have.property('currentPlayer', null);
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('pendingChip', null);
    expect(game).to.have.property('winner', null);
  });

  test('should initialize with arguments', async () => {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ],
      grid: new Grid({ columnCount: 9, rowCount: 8 })
    });
    expect(game.grid).to.have.property('columnCount', 9);
    expect(game.grid).to.have.property('rowCount', 8);
    expect(game.players).to.have.length(2);
    expect(game.players[0].name).toEqual('Bob');
    expect(game.players[1].name).toEqual('Larry');
    expect(game).to.have.property('currentPlayer', null);
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('pendingChip', null);
    expect(game).to.have.property('winner', null);
  });

  test('should initialize debug mode when set', async () => {
    const game = new Game({ debug: true });
    expect(game).to.have.property('debug', true);
    expect(game).to.have.property('columnHistory');
    expect(game.columnHistory).to.be.an('array');
    expect(game.columnHistory).to.have.length(0);
  });

  test('should initialize 1P game', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[1].type).toEqual('ai');
  });

  test('should initialize 2P game', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[1].type).toEqual('human');
  });

});

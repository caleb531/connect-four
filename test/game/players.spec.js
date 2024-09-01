import { test, expect } from '@playwright/test';
import Game from '../../scripts/models/game.js';

test.describe('game', async () => {
  test('should preserve players when continuing in 1P mode', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    game.players[0].score = 10;
    game.players[1].score = 20;
    game.endGame();
    game.setPlayers({ gameType: '1P' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[0].score).toEqual(10);
    expect(game.players[1].type).toEqual('ai');
    expect(game.players[1].score).toEqual(20);
  });

  test('should preserve players when continuing in 2P mode', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.players[0].score = 12;
    game.players[1].score = 16;
    game.endGame();
    game.setPlayers({ gameType: '2P' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[0].score).toEqual(12);
    expect(game.players[1].type).toEqual('human');
    expect(game.players[1].score).toEqual(16);
  });

  test('should preserve players when continuing in Online mode', async () => {
    const game = new Game();
    game.setPlayers({
      gameType: 'online',
      players: [
        { name: 'Abott', color: 'red' },
        { name: 'Costello', color: 'blue' }
      ],
      localPlayer: { name: 'Costello', color: 'blue' }
    });
    game.players[0].score = 12;
    game.players[1].score = 16;
    game.endGame();
    game.setPlayers({ gameType: 'online' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('online');
    expect(game.players[0].score).toEqual(12);
    expect(game.players[1].type).toEqual('human');
    expect(game.players[1].score).toEqual(16);
  });

  test('should initialize new players when switching from 1P to 2P', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    game.players[0].score = 10;
    game.players[1].score = 15;
    game.setPlayers({ gameType: '2P' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[0].score).toEqual(0);
    expect(game.players[1].type).toEqual('human');
    expect(game.players[1].score).toEqual(0);
  });

  test('should initialize new players when switching from 2P to 1P', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.players[0].score = 10;
    game.players[1].score = 15;
    game.setPlayers({ gameType: '1P' });
    expect(game.players).toHaveLength(2);
    expect(game.players[0].type).toEqual('human');
    expect(game.players[0].score).toEqual(0);
    expect(game.players[1].type).toEqual('ai');
    expect(game.players[1].score).toEqual(0);
  });

  test('should get other player', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    expect(game.getOtherPlayer(game.players[0])).toEqual(game.players[1]);
    expect(game.getOtherPlayer(game.players[1])).toEqual(game.players[0]);
  });
});

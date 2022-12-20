import Emitter from 'tiny-emitter';
import Game from '../../scripts/models/game.js';

describe('game', async () => {

  it('should start', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    vi.spyOn(Emitter.prototype, 'emit');
    try {
      game.startGame();
      expect(Emitter.prototype.emit).toHaveBeenCalledWith('game:start');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.currentPlayer).toEqual(game.players[0]);
    expect(game.inProgress).toBe(true);
  });

  it('should set starting player when starting', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.startGame({
      startingPlayer: game.players[1]
    });
    expect(game.currentPlayer).toEqual(game.players[1]);
    expect(game.inProgress).toBe(true);
  });

});

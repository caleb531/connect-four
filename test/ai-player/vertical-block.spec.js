import utils from './utils.js';

import Game from '../../scripts/models/game.js';

describe('AI player', async () => {

  it('should block vertical opponent win (#1)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 2, 3, 2, 3]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(3);
    });
  });

  it('should block vertical opponent win (#2)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [2, 0, 4, 3, 3, 0, 4, 0, 0, 2, 4]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(4);
    });
  });

  it('should block vertical opponent win (#3)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [0, 3, 4, 4, 5, 4, 5, 4, 5, 5, 4, 5, 3, 3, 3, 3, 3, 4, 0, 5, 0]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(0);
    });
  });

  it('should block vertical opponent win (#4)', async () => {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [2, 3, 4, 3, 3, 3, 1, 2, 4, 5, 2, 4, 0, 2, 0, 3, 0, 0, 5, 0, 5, 0, 5]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).toEqual(5);
    });
  });

});

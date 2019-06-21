import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

describe('AI player', function () {

  it('should block diagonal opponent win (#1)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game,
      columns: [4, 3, 3, 2, 1, 2, 2, 1, 1]
    });
    game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(1);
    });
  });

  it('should block diagonal opponent win (#2)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game,
      columns: [2, 3, 3, 5, 5, 5, 4, 4, 4]
    });
    game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(5);
    });
  });

});

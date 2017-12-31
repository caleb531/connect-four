import { expect } from 'chai';
import utils from './utils';

import Game from '../../app/scripts/models/game';

describe('AI player', function () {

  it('should block diagonal opponent win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [4, 3, 3, 2, 1, 2, 2, 1, 1]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(1);
  });

  it('should block diagonal opponent win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [2, 3, 3, 5, 5, 5, 4, 4, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

});

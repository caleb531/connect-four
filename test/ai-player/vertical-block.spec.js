import { expect } from 'chai';
import utils from './utils';

import Game from '../../app/scripts/models/game';

describe('AI player', function () {

  it('should block vertical opponent win (#1)', function () {
    let game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 2, 3, 2, 3]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(3);
  });

  it('should block vertical opponent win (#2)', function () {
    let game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [2, 0, 4, 3, 3, 0, 4, 0, 0, 2, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(4);
  });

  it('should block vertical opponent win (#3)', function () {
    let game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [0, 3, 4, 4, 5, 4, 5, 4, 5, 5, 4, 5, 3, 3, 3, 3, 3, 4, 0, 5, 0]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(0);
  });

  it('should block vertical opponent win (#4)', function () {
    let game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [2, 3, 4, 3, 3, 3, 1, 2, 4, 5, 2, 4, 0, 2, 0, 3, 0, 0, 5, 0, 5, 0, 5]
    });
    game.players[1].debug = true;
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

});

import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

describe('AI player', function () {

  it('should avoid losing move (#1)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [
        3, 6, 4, 1, 1, 4, 3, 3, 1, 1,
        3, 0, 0, 3, 0, 0, 2, 2, 2, 5,
        2, 4, 4, 4, 5, 0, 2, 2, 4, 6,
        6, 6, 6, 6, 3
      ]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 1]);
  });

  it('should avoid losing move (#2)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [
        3, 6, 0, 5, 3, 3, 0, 4, 6, 3,
        6, 1, 1, 4, 1, 3, 3, 1, 4, 1,
        4, 4, 5, 1, 5, 5, 5, 4, 5, 6,
        6, 6, 0, 0, 0
      ]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(0);
  });

  it('should avoid losing move (#3)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [
        3, 2, 6, 4, 6, 5, 5, 6, 6, 4,
        4, 5, 5, 3, 5, 4, 4, 4, 2, 5,
        2, 6, 6
      ]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 1, 2]);
  });

  it('should avoid losing move (#4)', function () {
    let game = new Game();
    game.setPlayers('1P');
    utils.placeChips({
      game: game,
      columns: [
        3, 2, 6, 4, 3, 2, 5, 4, 5, 6,
        4, 5, 5, 5, 4, 4, 6
      ]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 1, 2, 3, 4, 5]);
  });

});

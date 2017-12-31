import chai from 'chai';
var expect = chai.expect;
import utils from './utils';

import Game from '../../app/scripts/models/game';

describe('AI player', function () {

  it('should block one win of opponent double-win (#1)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 0, 2, 1, 3, 0, 3, 3, 0, 0, 2, 1, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([1, 2]);
  });

  it('should block one win of opponent double-win (#2)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [1, 0, 4, 2, 5, 3, 6, 0, 2, 2, 3, 0, 0, 0, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([1, 5]);
  });

  it('should block one win of opponent double-win (#3)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [0, 3, 1, 3, 3, 3, 2, 5, 4, 5, 4, 5, 4, 4, 5, 5, 2, 4, 1, 3, 0, 4, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([1, 2]);
  });

  it('should block one win of opponent double-win (#4)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 2, 2, 1, 3, 3, 1, 1, 2, 2, 0]
    });
    expect(game.players[1].computeNextMove(game).column).to.be.oneOf([0, 3]);
  });

  it('should block one win of opponent double-win (#5)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 2, 2, 1, 3, 3, 1, 1, 2, 2, 3]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(0);
  });

  it('should block one win of opponent double-win (#6)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [2, 1, 3, 4, 3, 2, 3, 3, 2, 2, 1, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 0, 5, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block one win of opponent double-win (#7)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 2, 3, 4, 2, 4, 3, 3, 2, 2, 4, 1, 1, 1, 4, 4, 6, 1, 3, 2, 1, 2, 6, 5, 6, 6, 6, 6, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block one win of opponent double-win (#8)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [2, 0, 3, 1, 4, 5, 1, 0, 2, 4, 3, 0, 5, 1, 3, 2, 4, 2, 0, 3, 1, 0, 3, 2, 2, 3, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should block one win of opponent double-win (#9)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 2, 2, 1, 3, 3, 1, 1, 2, 2, 1]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(4);
  });

  it('should block one win of opponent double-win (#10)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [
        3, 3, 0, 0, 1, 2, 2, 2, 3, 1,
        1, 2, 1, 1, 3, 2, 2, 3, 6, 5,
        5, 1, 4, 5, 6, 6, 5, 3, 5, 5,
        4
      ]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(4);
  });

  it('should block one win of opponent double-win (#11)', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [1, 4, 1, 4, 2, 5, 2, 6, 3, 5, 3]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(0);
  });

});

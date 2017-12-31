var chai = require('chai');
var expect = chai.expect;
var utils = require('./utils');

var Game = require('../../app/scripts/models/game');

describe('AI player', function () {

  it('should win horizontally on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [1, 2, 1, 3, 1, 1, 2, 4, 2]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

  it('should win vertically on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [3, 2, 3, 2, 5, 2, 4]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(2);
  });

  it('should win diagonally on turn', function () {
    var game = new Game();
    game.setPlayers(1);
    utils.placeChips({
      game: game,
      columns: [1, 2, 3, 3, 2, 4, 4, 4, 5, 5, 5]
    });
    expect(game.players[1].computeNextMove(game).column).to.equal(5);
  });

});

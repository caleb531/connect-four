import utils from './utils.js';

import Game from '../../app/scripts/models/game.js';

describe('AI player', function () {

  it('should block horizontal opponent win (#1)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 2, 5, 2, 6]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(4);
    });
  });

  it('should block horizontal opponent win (#2)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [1, 0, 4, 2, 5, 3, 6, 0, 2, 2, 1, 0, 0, 0, 3]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(4);
    });
  });

  it('should block horizontal opponent win (#3)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [2, 0, 4, 1, 6, 3, 2, 0, 3, 1, 4, 5, 0, 3, 0, 3, 2, 2, 4, 4, 2, 6, 6, 4, 3, 4, 2, 3, 6]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.equal(5);
    });
  });

  it('should block horizontal connect-three trap (#1)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 3, 5]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.be.oneOf([2, 4, 6]);
    });
  });

  it('should block horizontal connect-three trap (#2)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 1, 3, 3, 5]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.be.oneOf([2, 4, 6]);
    });
  });

  it('should block horizontal connect-three trap (#3)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 1, 3, 3, 4]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.be.oneOf([2, 5, 6]);
    });
  });

  it('should block horizontal connect-three trap (#4)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 3, 1]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.be.oneOf([0, 2, 4]);
    });
  });

  it('should block horizontal connect-three trap (#5)', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    utils.placeChips({
      game,
      columns: [3, 3, 4]
    });
    return game.players[1].getNextMove({ game }).then((nextMove) => {
      expect(nextMove.column).to.be.oneOf([2, 5, 6]);
    });
  });

});

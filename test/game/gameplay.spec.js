import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import Emitter from 'tiny-emitter';
import Game from '../../app/scripts/models/game.js';

describe('game', () => {

  // Place chips at the given columns in the given order
  function placeChips({ game, columns }) {
    columns.forEach((column) => {
      game.placePendingChip({column: column});
    });
  }

  it('should place pending chip', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    game.placePendingChip({column: 2});
    expect(game.grid.columns[2]).to.have.length(1);
    expect(game.grid.columns[2][0].player).to.equal(game.players[0]);
  });

  it('should win horizontally', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [2, 2, 3, 3, 4, 4, 5]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win vertically', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [0, 1, 0, 1, 0, 1, 0]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win diagonally', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [3, 4, 4, 3, 5, 5, 5, 6, 6, 6, 6]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win with two connect-fours at once', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [0, 1, 1, 1, 2, 2, 2, 0, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should win on connections of more than four', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [2, 2, 3, 3, 4, 4, 6, 6, 5]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-winner');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).not.to.be.null;
    expect(game.winner.name).to.equal('Human 1');
  });

  it('should end when grid becomes full', () => {
    let game = new Game();
    game.setPlayers(2);
    game.startGame();
    sinon.spy(Emitter.prototype, 'emit');
    try {
      placeChips({
        game: game,
        columns: [
          0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
          2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2,
          4, 5, 4, 5, 4, 5, 5, 4, 5, 4, 5, 4,
          6, 6, 6, 6, 6, 6
        ]
      });
      expect(Emitter.prototype.emit).to.have.been.calledWith('game:declare-tie');
    } finally {
      Emitter.prototype.emit.restore();
    }
    expect(game.winner).to.be.null;
    expect(game.inProgress).to.be.false;
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].score).to.equal(0);
  });

});

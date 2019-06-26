import Game from '../../app/scripts/models/game.js';
import Player from '../../app/scripts/models/player.js';
import Chip from '../../app/scripts/models/chip.js';

describe('game', function () {

  let session;

  beforeEach(function () {
     session = { on: () => {/* this is a noop */} };
  });

  it('restore state from server', function () {
    let game = new Game({
      session
    });
    let serverGame = {
      inProgress: true,
      players: [
        { name: 'Abott', color: 'red' },
        { name: 'Costello', color: 'blue' }
      ],
      currentPlayer: 'blue',
      requestingPlayer: 'red',
      grid: {
        columnCount: 7,
        rowCount: 6,
        columns: [
          [], [], [], [], [],
          [
            { column: 5, row: 0, player: 'blue' },
            { column: 5, row: 1, player: 'red' }
          ],
          []
        ]
      }
    };
    game.restoreFromServer({
      game: serverGame,
      localPlayer: serverGame.players[0]
    });
    expect(game.inProgress).to.equal(true);
    expect(game.players[0]).to.be.instanceOf(Player);
    expect(game.players[1]).to.be.instanceOf(Player);
    expect(game.type).to.equal('online');
    expect(game.currentPlayer).to.equal(game.players[1]);
    expect(game.requestingPlayer).to.equal(game.players[0]);
    expect(game.grid.columns[5][0]).to.be.instanceOf(Chip);
    expect(game.grid.columns[5][0].column).to.equal(5);
    expect(game.grid.columns[5][0].row).to.equal(0);
    expect(game.grid.columns[5][0].player).to.equal(game.players[1]);
    expect(game.grid.columns[5][1]).to.be.instanceOf(Chip);
    expect(game.grid.columns[5][1].column).to.equal(5);
    expect(game.grid.columns[5][1].row).to.equal(1);
    expect(game.grid.columns[5][1].player).to.equal(game.players[0]);
  });

});

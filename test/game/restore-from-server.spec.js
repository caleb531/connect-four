import Game from '../../app/scripts/models/game.js';
import Grid from '../../app/scripts/models/grid.js';
import HumanPlayer from '../../app/scripts/models/human-player.js';
import OnlinePlayer from '../../app/scripts/models/online-player.js';
import Chip from '../../app/scripts/models/chip.js';

describe('game', function () {

  let session;
  let game;
  let serverGame;
  let localUser;

  beforeEach(function () {
     session = { on: () => {/* this is a noop */} };
     game = new Game({ session });
     serverGame = {
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
         ],
         lastPlacedChip: { column: 5, row: 1, player: 'red' }
       }
     };
     localUser = serverGame.players[0];
  });

  it('should restore basic state from server', function () {
    game.restoreFromServer({ game: serverGame, localUser });
    expect(game.inProgress).to.equal(true);
    expect(game.type).to.equal('online');
  });

  it('should restore player data from server', function () {
    game.restoreFromServer({ game: serverGame, localUser });
    expect(game.players[0]).to.be.instanceOf(HumanPlayer);
    expect(game.players[1]).to.be.instanceOf(OnlinePlayer);
    expect(game.currentPlayer).to.equal(game.players[1]);
    expect(game.requestingPlayer).to.equal(game.players[0]);
  });

  it('should set correct player to online player', function () {
    localUser = serverGame.players[1];
    game.restoreFromServer({ game: serverGame, localUser });
    expect(game.players[0]).to.be.instanceOf(OnlinePlayer);
    expect(game.players[1]).to.be.instanceOf(HumanPlayer);
  });

  it('should restore grid data from server', function () {
    game.restoreFromServer({ game: serverGame, localUser });
    expect(game.grid).to.be.instanceOf(Grid);
    expect(game.grid.columns[5][0]).to.be.instanceOf(Chip);
    expect(game.grid.columns[5][0].column).to.equal(5);
    expect(game.grid.columns[5][0].row).to.equal(0);
    expect(game.grid.columns[5][0].player).to.equal(game.players[1]);
    expect(game.grid.columns[5][1]).to.be.instanceOf(Chip);
    expect(game.grid.columns[5][1].column).to.equal(5);
    expect(game.grid.columns[5][1].row).to.equal(1);
    expect(game.grid.columns[5][1].player).to.equal(game.players[0]);
    expect(game.grid.lastPlacedChip).to.equal(game.grid.columns[5][1]);
  });

  it('should restore lastPlacedChip as null if grid is empty', function () {
    serverGame.grid.lastPlacedChip = null;
    game.restoreFromServer({ game: serverGame, localUser });
    expect(game.grid.lastPlacedChip).to.be.null;
  });

});

import Game from '../../app/server/game.js';
import Grid from '../../app/server/grid.js';
import Player from '../../app/server/player.js';

describe('server game', function () {

  it('should initialize with arguments', function () {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ],
      grid: new Grid({ columnCount: 9, rowCount: 8 })
    });
    expect(game.grid).to.have.property('columnCount', 9);
    expect(game.grid).to.have.property('rowCount', 8);
    expect(game.players).to.have.length(2);
    expect(game.players[0].name).to.equal('Bob');
    expect(game.players[1].name).to.equal('Larry');
    expect(game).to.have.property('startingPlayer', null);
    expect(game).to.have.property('currentPlayer', null);
    expect(game).to.have.property('requestingPlayer', null);
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('pendingChipColumn', null);
    expect(game).to.have.property('winner', null);
  });

  it('should initialize with default grid', function () {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ]
    });
    expect(game.grid).to.have.property('columnCount', 7);
    expect(game.grid).to.have.property('rowCount', 6);
  });

  it('should start game', function () {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    expect(game).to.have.property('startingPlayer', null);
    game.startGame();
    expect(game).to.have.property('startingPlayer', players[1]);
    expect(game).to.have.property('currentPlayer', players[1]);
    expect(game).to.have.property('inProgress', true);
  });

  it('should alternate starting player when starting successive games', function () {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    expect(game).to.have.property('startingPlayer', null);
    game.startGame();
    expect(game).to.have.property('startingPlayer', players[1]);
    game.endGame();
    game.startGame();
    expect(game).to.have.property('startingPlayer', players[0]);
  });

  it('should end game', function () {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.startGame();
    game.endGame();
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('currentPlayer', null);
  });

  it('should reset game', function () {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.startGame();
    game.winner = players[1];
    game.endGame();
    game.requestingPlayer = players[0];
    game.resetGame();
    expect(game).to.have.property('inProgress', false);
    expect(game).to.have.property('requestingPlayer', null);
    expect(game).to.have.property('winner', null);
  });

  it('should place chip', function () {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    const game = new Game({
      players
    });
    game.startGame();
    expect(game).to.have.property('currentPlayer', players[1]);
    game.placeChip({
      column: 4
    });
    expect(game.grid.columns[4]).to.have.length(1);
    expect(game.grid.columns[4][0]).to.have.property('column', 4);
    expect(game.grid.columns[4][0]).to.have.property('player', 'black');
    expect(game).to.have.property('currentPlayer', players[0]);
  });

  it('should declare winner', function () {
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      new Player({ color: 'black', name: 'Larry' })
    ];
    players[0].lastSubmittedWinner = players[0];
    players[1].lastSubmittedWinner = players[0];
    const game = new Game({
      players
    });
    game.startGame();
    game.winner = players[0];
    game.endGame();
    expect(players[0].score).to.equal(0);
    game.declareWinner();
    expect(game.winner).to.equal(players[0]);
    expect(players[0].score).to.equal(1);
  });

  it('should serialize as JSON', function () {
    const game = new Game({
      players: [
        new Player({ color: 'blue', name: 'Bob' }),
        new Player({ color: 'black', name: 'Larry' })
      ],
      grid: new Grid({ columnCount: 9, rowCount: 8 })
    });
    game.currentPlayer = game.players[1];
    game.requestingPlayer = game.players[0];
    const json = game.toJSON();
    expect(json.grid).to.have.property('columnCount', 9);
    expect(json.grid).to.have.property('rowCount', 8);
    expect(json.players).to.have.length(2);
    expect(json.players[0].name).to.equal('Bob');
    expect(json.players[1].name).to.equal('Larry');
    expect(json).to.have.property('currentPlayer', 'black');
    expect(json).to.have.property('requestingPlayer', 'blue');
    expect(json).to.have.property('inProgress', false);
    expect(json).to.have.property('pendingChipColumn', null);
  });

});

import Game from '../../app/scripts/models/game.js';

describe('game', function () {

  it('should preserve players when continuing in 1P mode', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    game.players[0].score = 10;
    game.players[1].score = 20;
    game.endGame();
    game.setPlayers({ gameType: '1P' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(10);
    expect(game.players[1].type).to.equal('ai');
    expect(game.players[1].score).to.equal(20);
  });

  it('should preserve players when continuing in 2P mode', function () {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.players[0].score = 12;
    game.players[1].score = 16;
    game.endGame();
    game.setPlayers({ gameType: '2P' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(12);
    expect(game.players[1].type).to.equal('human');
    expect(game.players[1].score).to.equal(16);
  });

  it('should preserve players when continuing in Online mode', function () {
    const game = new Game();
    game.setPlayers({
      gameType: 'online',
      players: [
        { name: 'Abott', color: 'red' },
        { name: 'Costello', color: 'blue' }
      ],
      localPlayer: { name: 'Costello', color: 'blue' }
    });
    game.players[0].score = 12;
    game.players[1].score = 16;
    game.endGame();
    game.setPlayers({ gameType: 'online' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('online');
    expect(game.players[0].score).to.equal(12);
    expect(game.players[1].type).to.equal('human');
    expect(game.players[1].score).to.equal(16);
  });

  it('should initialize new players when switching from 1P to 2P', function () {
    const game = new Game();
    game.setPlayers({ gameType: '1P' });
    game.players[0].score = 10;
    game.players[1].score = 15;
    game.setPlayers({ gameType: '2P' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].type).to.equal('human');
    expect(game.players[1].score).to.equal(0);
  });

  it('should initialize new players when switching from 2P to 1P', function () {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    game.players[0].score = 10;
    game.players[1].score = 15;
    game.setPlayers({ gameType: '1P' });
    expect(game.players).to.have.length(2);
    expect(game.players[0].type).to.equal('human');
    expect(game.players[0].score).to.equal(0);
    expect(game.players[1].type).to.equal('ai');
    expect(game.players[1].score).to.equal(0);
  });

  it('should get other player', function () {
    const game = new Game();
    game.setPlayers({ gameType: '2P' });
    expect(game.getOtherPlayer(game.players[0])).to.equal(game.players[1]);
    expect(game.getOtherPlayer(game.players[1])).to.equal(game.players[0]);
  });

});

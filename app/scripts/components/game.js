import m from 'mithril';
import classNames from '../classnames.js';
import Game from '../models/game.js';
import GridComponent from './grid.js';
import DashboardComponent from './dashboard.js';
import ScoreboardComponent from './scoreboard.js';

// The game UI, encompassing all UI pertaining to the game directly
class GameComponent {

  oninit({ attrs: { session, roomCode } }) {
    this.session = session;
    this.game = new Game({
      session,
      // Only enable debug mode on non-production sites
      debug: (window.location.host !== 'projects.calebevans.me' && !window.__karma__)
    });
    if (roomCode) {
      this.session.connect();
      this.session.on('connect', () => {
        this.joinRoom(roomCode);
        this.listenForNewPlayers();
        this.listenForEndGame();
      });
    }
  }

  joinRoom(roomCode) {
    let playerId = this.session.localPlayerId;
    // Join the room immediately if a room code is specified in the URL
    this.session.emit('join-room', { roomCode, playerId }, ({ game, localPlayer }) => {
      console.log('join room', roomCode, this.session.status);
      if (game && localPlayer) {
        this.game.restoreFromServer({ game, localPlayer });
      }
      m.redraw();
    });
  }

  listenForNewPlayers() {
    // If P1 leaves and rejoins the game before P2 joins, make sure to
    // listen for P2 joining
    this.session.on('add-player', ({ game, localPlayer }) => {
      this.game.restoreFromServer({ game, localPlayer });
      m.redraw();
    });
  }

  listenForEndGame() {
    this.session.on('end-game', ({ requestingPlayer }) => {
      this.game.requestingPlayer = requestingPlayer;
      this.game.endGame();
      m.redraw();
    });
  }

  view({ attrs: { roomCode } }) {
    return m('div#game', {
      class: classNames({ 'in-progress': this.game.inProgress })
    }, [
      m('div.game-column', [
        m('h1', 'Connect Four'),
        m(DashboardComponent, {
          game: this.game,
          session: this.session,
          roomCode
        })
      ]),
      m('div.game-column', [
        m(GridComponent, { game: this.game, session: this.session }),
        m(ScoreboardComponent, { game: this.game, session: this.session })
      ])
    ]);
  }

}

export default GameComponent;

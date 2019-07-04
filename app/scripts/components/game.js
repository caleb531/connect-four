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
      // Only enable debug mode on non-production sites
      debug: (window.location.host !== 'projects.calebevans.me' && !window.__karma__)
    });
    if (roomCode) {
      this.session.connect();
      this.joinRoom({ roomCode });
    }
    // When the app initializes, queue event listeners for online game events;
    // if P1 has not started an online game yet, the event listeners will be
    // queued until an online room is opened or joined (which is when the socket
    // connection is opened)
    this.listenForOnlineGameEvents({ roomCode });
  }

  joinRoom({ roomCode }) {
    // Join the room immediately if a room code is specified in the URL; the
    // room code and local player ID are implicitly and automatically passed by
    // the Session class
    this.session.emit('join-room', {}, ({ game, localPlayer }) => {
      console.log('join room', roomCode, this.session.status);
      if (game) {
        this.game.restoreFromServer({ game, localPlayer });
      }
      m.redraw();
    });
  }

  listenForOnlineGameEvents({ roomCode }) {
    // When P2 joins an online game, automatically update P1's screen
    this.session.on('add-player', ({ game, localPlayer }) => {
      this.game.restoreFromServer({ game, localPlayer });
      m.redraw();
    });
    // If either player ends an online game early, automatically update the
    // local player's game instance and indicate who ended the game
    this.session.on('end-game', ({ requestingPlayer }) => {
      this.game.requestingPlayer = requestingPlayer;
      this.game.endGame();
      m.redraw();
    });
    this.session.on('request-new-game', ({ requestingPlayer }) => {
      this.game.requestingPlayer = requestingPlayer;
      m.redraw();
    });
    this.session.on('start-new-game', ({ game, localPlayer }) => {
      this.game.restoreFromServer({ game, localPlayer });
      m.redraw();
    });
    this.session.on('other-player-disconnected', ({ otherPlayer }) => {
      this.session.otherPlayer = otherPlayer;
      console.log('other player disconnected', this.session);
      m.redraw();
    });
    this.session.on('other-player-reconnected', ({ otherPlayer }) => {
      this.session.otherPlayer = otherPlayer;
      console.log('other player reconnected', this.session);
      m.redraw();
    });
    this.session.on('disconnect', () => {
      // At this point, the session object's `disconnected` flag is
      // automatically set to true
      m.redraw();
    });
    this.session.on('reconnect', () => {
      this.joinRoom({ roomCode });
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

/* global ga:true */

import _ from 'underscore';
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
    this.initializeAnalytics();
    this.joinExistingRoom(roomCode);
  }

  joinExistingRoom(roomCode) {
    if (roomCode) {
      this.session.connect();
      this.session.on('connect', () => {
        let playerId = this.session.playerId;
        /* eslint-disable-next-line no-shadow */
        this.session.emit('join-room', { roomCode, playerId }, ({ status, player }) => {
          console.log('join room', roomCode);
          this.session.status = status;
          if (this.session.status === 'returning-player') {
            console.log('resume existing game', player);
          } else if (this.session.status === 'new-player') {
            console.log('new player');
          }
          m.redraw();
        });
      });
    }
  }

  initializeAnalytics() {
    // Configure hooks for analytics
    this.game.on('game:start', () => {
      this.sendAnalytics({ eventAction: 'Start Game' });
    });
    this.game.on('game:end', () => {
      // The game ends automatically when a winner is declared or in the event of
      // a tie, but the game can also be ended at any time by the user; only
      // send analytics for when the user ends the game
      if (!this.game.winner && !this.game.grid.checkIfFull()) {
        this.sendAnalytics({ eventAction: 'End Game (User)' });
      }
    });
    this.game.on('game:declare-winner', (winner) => {
      // Only send win analytics for 1-player games
      if (this.game.humanPlayerCount === 1) {
        this.sendAnalytics({
          eventAction: 'Win / Tie',
          eventLabel: winner.type === 'ai' ? 'AI Wins' : 'Human Wins',
          eventValue: this.game.grid.getChipCount(),
          nonInteraction: true
        });
      }
    });
    this.game.on('game:declare-tie', () => {
      if (this.game.humanPlayerCount === 1) {
        this.sendAnalytics({
          eventAction: 'Win / Tie',
          eventLabel: 'Tie',
          nonInteraction: true
        });
      }
    });
  }

  // Send the specified game data to the analytics server
  sendAnalytics(args) {
    if (typeof ga === 'function' && !this.game.debug) {
      ga('send', 'event', _.extend({
        eventCategory: this.game.humanPlayerCount === 1 ? '1-Player Game' : '2-Player Game'
      }, args));
    }
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

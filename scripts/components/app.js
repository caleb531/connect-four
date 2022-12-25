import m from 'mithril';
import Session from '../models/session.js';
import GameComponent from './game.js';
import UpdateNotificationComponent from './update-notification.js';

class AppComponent {
  oninit({ attrs = { roomCode: null } }) {
    this.session = new Session({
      url: window.location.origin,
      roomCode: attrs.roomCode
    });
  }

  view({ attrs = { roomCode: null } }) {
    return m('div#app', [
      // The UpdateNotificationComponent manages its own visibility
      m(UpdateNotificationComponent),
      m('span#personal-site-link.nav-link.nav-link-left', [
        m(
          'a[href="https://github.com/caleb531/connect-four"]',
          'View on GitHub'
        )
      ]),
      m('span#github-link.nav-link.nav-link-right', [
        'by ',
        m('a[href="https://calebevans.me"]', 'Caleb Evans')
      ]),
      m(GameComponent, { session: this.session, roomCode: attrs.roomCode })
    ]);
  }
}

export default AppComponent;

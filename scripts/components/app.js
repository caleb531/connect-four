import m from 'mithril';
import Session from '../models/session.js';
import GameComponent from './game.js';
import UpdateNotificationComponent from './update-notification.js';
import SWUpdateManager from 'sw-update-manager';

class AppComponent {

  oninit({ attrs = { roomCode: null } }) {
    this.session = new Session({
      url: window.location.origin,
      roomCode: attrs.roomCode
    });
    if (navigator.serviceWorker && (window.location.hostname !== 'localhost' || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('sw')))) {
      const serviceWorker = navigator.serviceWorker.register('/service-worker.js');
      this.updateManager = new SWUpdateManager(serviceWorker);
      this.updateManager.on('updateAvailable', () => m.redraw());
      this.updateManager.checkForUpdates();
    }
  }

  view({ attrs = { roomCode: null } }) {
    return m('div#app', [
      this.updateManager ? m(UpdateNotificationComponent, {
        updateManager: this.updateManager
      }) : null,
      m('span#personal-site-link.nav-link.nav-link-left', [
        m('a[href="https://github.com/caleb531/connect-four"]', 'View on GitHub')
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

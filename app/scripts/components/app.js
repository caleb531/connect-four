import m from 'mithril';
import Session from '../models/session.js';
import GameComponent from './game.js';
import UpdateNotificationComponent from './update-notification.js';
import SWUpdateManager from 'sw-update-manager';

class AppComponent {

  oninit() {
    this.session = new Session({
      url: window.location.origin
    });
    if (navigator.serviceWorker && !window.__karma__ && window.location.port !== '8080') {
      let serviceWorker = navigator.serviceWorker.register('/service-worker.js');
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
      m(GameComponent, { session: this.session, roomCode: attrs.roomCode })
    ]);
  }

}

export default AppComponent;

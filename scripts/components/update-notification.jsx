import m from 'mithril';
import clsx from 'clsx';
import { registerSW } from 'virtual:pwa-register';

class UpdateNotificationComponent {

  // Use Vite PWA plugin to manage service worker updates (source:
  // <https://vite-pwa-org.netlify.app/guide/prompt-for-update.html#importing-virtual-modules>)
  oninit() {
    if (!navigator.serviceWorker) {
      return;
    }
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !sessionStorage.getItem('sw')) {
      return;
    }
    this.isUpdateAvailable = false;
    this.updateSW = registerSW({
      onNeedRefresh: () => {
        this.isUpdateAvailable = true;
        m.redraw();
      }
    });
  }

  update() {
    if (this.updateSW) {
      this.updateSW();
    }
  }

  view() {
    return m('div', {
      class: clsx('update-notification', { 'update-available': this.isUpdateAvailable }),
      onclick: () => this.update()
    }, [
      m('span.update-notification-message', 'Update available! Click here to update.')
    ]);
  }

}

export default UpdateNotificationComponent;

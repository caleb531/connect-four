import m from 'mithril';
import classNames from 'classnames';

class UpdateNotificationComponent {

  view({ attrs: { updateManager } }) {
    return m('div.update-notification', {
      class: classNames({ 'update-available': updateManager.isUpdateAvailable }),
      onclick: () => updateManager.update()
    }, [
      m('span.update-notification-message', 'Update available! Click here to update.')
    ]);
  }

}

export default UpdateNotificationComponent;

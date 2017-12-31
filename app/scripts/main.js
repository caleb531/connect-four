import m from 'mithril';
import attachFastClick from 'fastclick';
import GameComponent from './components/game';

m.mount(document.querySelector('main'), GameComponent);
attachFastClick(document.body);

// Load service worker to enable offline access
if (navigator.serviceWorker && !window.__karma__) {
  navigator.serviceWorker.register('service-worker.js');
}

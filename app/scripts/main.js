'use strict';

var m = require('mithril');
var attachFastClick = require('fastclick');
var GameComponent = require('./components/game');

m.mount(document.querySelector('main'), GameComponent);
attachFastClick(document.body);

// Load service worker to enable offline access
if (navigator.serviceWorker && !window.__karma__) {
  navigator.serviceWorker.register('service-worker.js');
}

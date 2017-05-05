'use strict';

var m = require('mithril');
var attachFastClick = require('fastclick');
var GameComponent = require('./components/game');

m.mount(document.getElementById('app'), GameComponent);
attachFastClick(document.body);

// Load service worker to enable offline access
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

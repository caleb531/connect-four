'use strict';

var m = require('mithril');
var attachFastClick = require('fastclick');
var GameComponent = require('./components/game');

m.mount(document.getElementById('game'), GameComponent);
attachFastClick(document.body);

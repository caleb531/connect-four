'use strict';

var m = require('mithril');
var attachFastClick = require('fastclick');
var GameComponent = require('./components/game');

m.mount(document.getElementById('app'), GameComponent);
attachFastClick(document.body);

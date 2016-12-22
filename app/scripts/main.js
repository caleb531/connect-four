'use strict';

var m = require('mithril');
var Game = require('./game');

m.mount(document.getElementById('game'), Game.Component);

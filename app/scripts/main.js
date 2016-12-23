'use strict';

var m = require('mithril');
var attachFastClick = require('fastclick');
var Game = require('./game');

m.mount(document.getElementById('game'), Game.Component);
attachFastClick(document.body);

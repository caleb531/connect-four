'use strict';

var m = require('mithril');
var Game = require('../models/game');
var GridComponent = require('./grid');
var DashboardComponent = require('./dashboard');
var ScoreboardComponent = require('./scoreboard');

// The game UI, encompassing all UI pertaining to the game directly
var GameComponent = {};

GameComponent.oninit = function (vnode) {
  vnode.state.game = new Game({
    // Only enable debug mode on non-production sites
    debug: (window.location.host !== 'projects.calebevans.me')
  });
};

GameComponent.view = function (vnode) {
  return m('div#game', [
    m(DashboardComponent, vnode.state),
    m(GridComponent, vnode.state),
    m(ScoreboardComponent, vnode.state)
  ]);
};

module.exports = GameComponent;

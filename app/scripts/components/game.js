'use strict';

var m = require('mithril');
var Game = require('../models/game');
var GridComponent = require('./grid');
var DashboardComponent = require('./dashboard');
var ScoreboardComponent = require('./scoreboard');


var GameComponent = {};

GameComponent.oninit = function (vnode) {
  vnode.state.game = new Game({
    // Only enable debug mode on non-production sites
    debug: (window.location.host !== 'projects.calebevans.me')
  });
};

GameComponent.view = function (vnode) {
  return [
    m(DashboardComponent, {game: vnode.state.game}),
    m(GridComponent, {game: vnode.state.game}),
    m(ScoreboardComponent, {game: vnode.state.game})
  ];
};

module.exports = GameComponent;

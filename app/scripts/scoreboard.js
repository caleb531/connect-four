'use strict';

var m = require('mithril');
var _ = require('underscore');
var classNames = require('classnames');

var Scoreboard = {};
Scoreboard.Component = {};

Scoreboard.Component.view = function (ctrl, game) {
  return m('div#game-scoreboard', game.players.map(function (player) {
    return m('div.player-stats', {class: classNames(player.color)}, [
      m('div.player-name', player.name),
      m('div.player-score', player.score)
    ]);
  }));
};

module.exports = Scoreboard;

'use strict';

var m = require('mithril');
var classNames = require('classnames');

var ScoreboardComponent = {};

ScoreboardComponent.view = function (vnode) {
  var game = vnode.attrs.game;
  return m('div#game-scoreboard', game.players.map(function (player) {
    return m('div.player-stats', {class: classNames(player.color)}, [
      m('div.player-name', player.name),
      m('div.player-score', player.score)
    ]);
  }));
};

module.exports = ScoreboardComponent;

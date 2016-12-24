'use strict';

var m = require('mithril');
var _ = require('underscore');

var Dashboard = {};
Dashboard.Component = {};

Dashboard.Component.controller = function () {
  return {
    // Start a new game (for the first time or not)
    startGame: function (game) {
      if (game.players.length > 0) {
        game.resetGame();
      }
      game.startGame();
    },
    endGame: function (game) {
      game.endGame();
    }
  };
};

Dashboard.Component.view = function (ctrl, game) {
  return m('div', {id: 'game-dashboard'}, [
    game.inProgress ? [
      m('label', '2-Player Game'),
      m('button', {onclick: _.partial(ctrl.endGame, game)}, 'End Game')
    ] : [
      m('label', '2 Players'),
      m('button', {onclick: _.partial(ctrl.startGame, game)}, 'New Game')
    ],
    m('p', {id: 'game-message'},
      game.winner ?
        game.winner.name + ' wins!' :
      game.currentPlayer ?
        game.currentPlayer.name + ', you\'re up!' :
      game.players.length === 0 ?
        'Welcome! Click a button above to start.' :
      'Game has ended.'
    )
  ]);
};

module.exports = Dashboard;

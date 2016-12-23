'use strict';

var m = require('mithril');
var _ = require('underscore');

var Dashboard = {};
Dashboard.Component = {};

Dashboard.Component.controller = function () {
  return {
    startGame: function (game) {
      game.startGame();
    },
    resetGame: function (game) {
      game.resetGame();
    }
  };
};

Dashboard.Component.view = function (ctrl, game) {
  return m('div', {id: 'game-dashboard'}, [
    game.players.length === 0 ? [
      // Initially ask user to choose number of players to start game
      m('label', 'Start Game:'),
      // m('button', {onclick: _.partial(ctrl.startGame, game, 1)}, '1 Player'),
      m('button', {onclick: _.partial(ctrl.startGame, game)}, '2 Players'),
      m('p', {id: 'game-message'}, 'Choose a number of players to start a game.')
    ] : [
      // If game is in progress, display the number of players are whose turn it
      // is (also provide an option to stop the game)
      m('label', (game.players[1].ai ? 1 : 2) + '-Player Game'),
      m('button', {onclick: _.partial(ctrl.resetGame, game)}, 'End Game'),
      m('p', {id: 'game-message'}, game.currentPlayer.ai ?
        'It\'s the AI\'s turn!'
        : ('It\'s player ' + game.currentPlayer.playerNum + '\'s turn!'))
    ]
  ]);
};

module.exports = Dashboard;

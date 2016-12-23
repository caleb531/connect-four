'use strict';

var m = require('mithril');
var _ = require('underscore');

var Dashboard = {};
Dashboard.Component = {};

Dashboard.Component.controller = function () {
  return {
    // Start a game for the first time
    startGame: function (game) {
      game.startGame();
    },
    // Start a new game after a game has finished
    startNewGame: function (game) {
      game.resetGame();
      game.startGame();
    },
    endGame: function (game) {
      game.endGame();
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
      m('label', (game.players[1].ai ? 1 : 2) + '-Player Game'),
      // Give user option to end current game or start new game
      game.inProgress ?
        m('button', {onclick: _.partial(ctrl.endGame, game)}, 'End Game')
        : m('button', {onclick: _.partial(ctrl.startNewGame, game)}, 'New Game'),
      // Display status of current game
      m('p', {id: 'game-message'},
        game.winner ?
          game.winner.name + ' wins!'
          : game.currentPlayer ?
            game.currentPlayer.name + ', you\'re up!'
            : 'Game has ended')
    ]
  ]);
};

module.exports = Dashboard;

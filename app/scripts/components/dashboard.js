'use strict';

var m = require('mithril');
var _ = require('underscore');

var DashboardComponent = {};

DashboardComponent.controller = function () {
  return {
    // Whether or not to show the welcome message
    showWelcome: true,
    // Start a new game (for the first time or not)
    startGame: function (ctrl, game) {
      if (ctrl.showWelcome) {
        ctrl.showWelcome = false;
      } else {
        // Reset the game before starting successive new games
        game.resetGame();
      }
      game.startGame();
    },
    endGame: function (ctrl, game) {
      game.endGame();
    }
  };
};

DashboardComponent.view = function (ctrl, game) {
  return m('div', {id: 'game-dashboard'}, [
    game.inProgress ? [
      m('label', '2-Player Game'),
      m('button', {onclick: _.partial(ctrl.endGame, ctrl, game)}, 'End Game')
    ] : [
      m('label', '2 Players'),
      m('button', {onclick: _.partial(ctrl.startGame, ctrl, game)}, 'New Game')
    ],
    m('p', {id: 'game-message'},
      game.winner ?
        game.winner.name + ' wins!' :
      game.currentPlayer ?
        game.currentPlayer.name + ', you\'re up!' :
      game.grid.checkIfFull() ?
        'Looks like the grid is full. We\'ll call it a draw!' :
      ctrl.showWelcome ?
        'Welcome! Press a button above to start.' :
      'Game has ended.'
    )
  ]);
};

module.exports = DashboardComponent;

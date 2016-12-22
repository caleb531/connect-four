'use strict';

var m = require('mithril');
var _ = require('underscore');

var Controls = {};
Controls.Component = {};

Controls.Component.controller = function () {
  return {
    startGame: function (game, playerCount) {
      game.startGame({playerCount: playerCount});
    },
    resetGame: function (game) {
      game.resetGame();
    }
  };
};

Controls.Component.view = function (ctrl, game) {
  return m('div', {id: 'game-controls'}, [
    game.players.length === 0 ? [
      // Initially ask user to choose number of players to start game
      m('label', 'Start Game:'),
      // m('button', {onclick: _.partial(ctrl.startGame, game, 1)}, '1 Player'),
      m('button', {onclick: _.partial(ctrl.startGame, game, 2)}, '2 Players'),
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

module.exports = Controls;

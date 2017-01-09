'use strict';

var m = require('mithril');
var _ = require('underscore');

var DashboardComponent = {};

DashboardComponent.controller = function () {
  return {
    // Whether or not to show the welcome message
    showWelcome: true,
    // Prepare game players by creating new players (if necessary) and deciding
    // which player has the starting move
    setPlayers: function (ctrl, game, humanPlayerCount) {
      game.setPlayers(humanPlayerCount);
    },
    setStartingPlayer: function (ctrl, game, newStartingPlayer) {
      game.startGame({
        startingPlayer: newStartingPlayer
      });
    },
    endGame: function (ctrl, game) {
      game.endGame();
    }
  };
};

DashboardComponent.view = function (ctrl, game) {
  return m('div', {id: 'game-dashboard'}, [
    m('p', {id: 'game-message'},
      game.winner ?
        game.winner.name + ' wins!' :
      game.currentPlayer ?
        game.currentPlayer.name + ', you\'re up!' :
      game.grid.checkIfFull() ?
        'Looks like the grid is full. We\'ll call it a draw!' :
      game.humanPlayerCount === null ?
        'How many players?' :
      !game.inProgress ?
        'Which player should start first?' :
      game.players.length === 0 ?
        'Welcome! How many players?' :
      'Game has ended.'
    ),
    // Game is in progress; show option to end it
    game.inProgress ? [
      m('button', {
        onclick: _.partial(ctrl.endGame, ctrl, game)
      }, 'End Game')
    ] :
    // Select a starting player
    game.humanPlayerCount !== null ?
      game.players.map(function (player) {
        return m('button', {
          onclick: _.partial(ctrl.setStartingPlayer, ctrl, game, player)
        }, player.name);
      }) :
    // Select a number of human players
    [
      m('button', {
        onclick: _.partial(ctrl.setPlayers, ctrl, game, 1)
      }, '1 Player'),
      m('button', {
        onclick: _.partial(ctrl.setPlayers, ctrl, game, 2)
      }, '2 Players')
    ]
  ]);
};

module.exports = DashboardComponent;

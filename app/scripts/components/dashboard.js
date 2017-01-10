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
    setStartingPlayer: function (ctrl, game, startingPlayer) {
      game.startGame({
        startingPlayer: startingPlayer
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
      // If user has not started any game yet
      game.players.length === 0 ?
        'Welcome! How many players?' :
      // If a game is in progress
      game.currentPlayer ?
        game.currentPlayer.name + ', your turn!' :
      // If a player wins the game
      game.winner ?
        game.winner.name + ' wins! Play again?' :
      // If the grid is completely full
      game.grid.checkIfFull() ?
        'We\'ll call it a draw! Play again?' :
      // If the user just chose a number of players for the game to be started
      game.humanPlayerCount !== null ?
        'Which player should start first?' :
      // Otherwise, if game was ended manually by the user
      'Game ended. Play again?'
    ),
    // If game is in progress, allow user to end game at any time
    game.inProgress ? [
      m('button', {
        onclick: _.partial(ctrl.endGame, ctrl, game)
      }, 'End Game')
    ] :
    // If number of players has been chosen, ask user to choose starting player
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

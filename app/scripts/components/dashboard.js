var _ = require('underscore');
var m = require('mithril');

// The area of the game UI consisting of game UI controls and status messages
var DashboardComponent = {};

DashboardComponent.oninit = function (vnode) {
  var game = vnode.attrs.game;
  _.extend(vnode.state, {
    // Prepare game players by creating new players (if necessary) and deciding
    // which player has the starting move
    setPlayers: function (humanPlayerCount) {
      if (game.players.length > 0) {
        // Reset new games before choosing number of players (no need to reset
        // the very first game)
        game.resetGame();
      }
      game.setPlayers(humanPlayerCount);
    },
    startGame: function (newStartingPlayer) {
      game.startGame({
        startingPlayer: newStartingPlayer
      });
    },
    endGame: function () {
      game.endGame();
    }
  });
};

DashboardComponent.view = function (vnode) {
  var state = vnode.state;
  var game = vnode.attrs.game;
  return m('div#game-dashboard', [
    m('p#game-message',
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
      m('button', {onclick: state.endGame}, 'End Game')
    ] :
    // If number of players has been chosen, ask user to choose starting player
    game.humanPlayerCount !== null ?
      game.players.map(function (player) {
        return m('button', {
          onclick: function () {
            return state.startGame(player);
          }
        }, player.name);
      }) :
    // Select a number of human players
    [
      m('button', {
        onclick: function () {
          state.setPlayers(1);
        }
      }, '1 Player'),
      m('button', {
        onclick: function () {
          state.setPlayers(2);
        }
      }, '2 Players')
    ]
  ]);
};

module.exports = DashboardComponent;

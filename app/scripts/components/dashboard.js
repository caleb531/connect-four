import m from 'mithril';

// The area of the game UI consisting of game UI controls and status messages
class DashboardComponent {

  oninit(vnode) {
    this.game = vnode.attrs.game;
  }

  // Prepare game players by creating new players (if necessary) and deciding
  // which player has the starting move
  setPlayers(humanPlayerCount) {
    if (this.game.players.length > 0) {
      // Reset new games before choosing number of players (no need to reset
      // the very first game)
      this.game.resetGame();
    }
    this.game.setPlayers(humanPlayerCount);
  }

  startGame(newStartingPlayer) {
    this.game.startGame({
      startingPlayer: newStartingPlayer
    });
  }

  endGame() {
    this.game.endGame();
  }

  view() {
    return m('div#game-dashboard', [
      m('p#game-message',
        // If user has not started any game yet
        this.game.players.length === 0 ?
          'Welcome! How many players?' :
        // If a game is in progress
        this.game.currentPlayer ?
          this.game.currentPlayer.name + ', your turn!' :
        // If a player wins the game
        this.game.winner ?
          this.game.winner.name + ' wins! Play again?' :
        // If the grid is completely full
        this.game.grid.checkIfFull() ?
          'We\'ll call it a draw! Play again?' :
        // If the user just chose a number of players for the game to be started
        this.game.humanPlayerCount !== null ?
          'Which player should start first?' :
        // Otherwise, if game was ended manually by the user
        'Game ended. Play again?'
      ),
      // If game is in progress, allow user to end game at any time
      this.game.inProgress ? [
        m('button', {onclick: () => this.endGame()}, 'End Game')
      ] :
      // If number of players has been chosen, ask user to choose starting player
      this.game.humanPlayerCount !== null ?
        this.game.players.map((player) => {
          return m('button', {
            onclick: () => this.startGame(player)
          }, player.name);
        }) :
        // Select a number of human players
        [
          m('button', {
            onclick: () => this.setPlayers(1)
          }, '1 Player'),
          m('button', {
            onclick: () => this.setPlayers(2)
          }, '2 Players')
        ]
    ]);
  }

}

export default DashboardComponent;

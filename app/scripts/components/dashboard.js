import m from 'mithril';
import classNames from '../classnames.js';
import DashboardControlsComponent from './dashboard-controls.js';

// The area of the game UI consisting of game UI controls and status messages
class DashboardComponent {

  oninit({ attrs: { game, session } }) {
    this.game = game;
    this.session = session;
  }

  view({ attrs: { roomCode } }) {
    return m('div#game-dashboard', {
      class: classNames({ 'prompting-for-input': this.session.status === 'newPlayer' })
    }, [
      m('p#game-message',

        this.session.status === 'connecting' ?
          'Connecting to server...' :
        this.session.status === 'roomNotFound' ?
          [
            'This room does not exist',
            m('br'),
            'or has been closed by the host.'
          ] :
        this.session.status === 'closingRoom' || this.session.status === 'closedRoom' ?
          'Closing room...' :
        this.session.status === 'decliningNewGame' || this.session.status === 'declinedNewGame' ?
          'Leaving room...' :
        this.session.disconnected ?
          'Lost connection. Trying to reconnect...' :

        // If the other player disconnects
        this.session.disconnectedPlayer && this.session.disconnectedPlayer.lastDisconnectReason === 'newGameDeclined' ?
          `${this.session.disconnectedPlayer.name} has declined to play again.` :
        this.session.disconnectedPlayer ?
          `${this.session.disconnectedPlayer.name} has disconnected.` :

        // If the other player reconnects
        this.session.reconnectedPlayer ?
          `${this.session.reconnectedPlayer.name} has reconnected.` :

        // If the current player needs to enter a name
        this.session.status === 'newPlayer' ?
          m('label[for=new-player-name]', 'Enter your player name:') :

        // If the local player has requested a new game
        this.session.status === 'requestingNewGame' ?
          `Asking ${this.game.getOtherPlayer(this.game.requestingPlayer).name} to play again...` :
        // Inform the other player if a player requests a new game
        this.session.status === 'newGameRequested' ?
          `${this.game.requestingPlayer.name} asks to play again.` :
        // If user has not started any game yet
        this.game.players.length === 0 ?
          'Welcome! How many players?' :
        // If a game is in progress
        this.game.currentPlayer ?
          `${this.game.currentPlayer.name}, your turn!` :
        // If a player wins the game
        this.game.winner ?
          `${this.game.winner.name} wins! Play again?` :
        // If the grid is completely full
        this.game.grid.checkIfFull() ?
          'We\'ll call it a draw! Play again?' :
        // If the user just chose a number of players for the game to be started
        !this.session.socket && this.game.type !== null ?
          'Which player should start first?' :
        // If either player ends the game early
        roomCode && this.game.requestingPlayer ?
          `${this.game.requestingPlayer.name} has ended the game.` :
        this.session.status === 'waitingForPlayers' ?
          'Waiting for other player...' :
        // Otherwise, if game was ended manually by the user
        'Game ended. Play again?'
      ),

      m(DashboardControlsComponent, {
        game: this.game,
        session: this.session,
        roomCode
      })

    ]);
  }

}

export default DashboardComponent;

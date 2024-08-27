import m from 'mithril';
import DashboardControlsComponent from './dashboard-controls.jsx';
import clsx from 'clsx';

// The area of the game UI consisting of game UI controls and status messages
class DashboardComponent {
  view({ attrs: { game, session, roomCode } }) {
    return (
      <div
        id="game-dashboard"
        className={clsx({
          'prompting-for-input': session.status === 'newPlayer'
        })}
      >
        <p id="game-message">
          {session.status === 'connecting' ? (
            'Connecting to server...'
          ) : session.status === 'roomNotFound' ? (
            <>
              This room does not exist
              <br />
              or has been closed by the host.
            </>
          ) : session.status === 'closingRoom' || session.status === 'closedRoom' ? (
            'Closing room...'
          ) : session.status === 'leavingRoom' ||
            session.status === 'decliningNewGame' ||
            session.status === 'declinedNewGame' ? (
            'Leaving room...'
          ) : session.disconnected ? (
            <>
              Lost connection.
              <br />
              Please reload the page to reconnect.
            </>
          ) : session.disconnectedPlayer &&
            session.disconnectedPlayer.lastDisconnectReason === 'newGameDeclined' ? (
            `${session.disconnectedPlayer.name} has declined to play again.`
          ) : session.disconnectedPlayer ? (
            `${session.disconnectedPlayer.name} has disconnected.`
          ) : session.reconnectedPlayer ? (
            `${session.reconnectedPlayer.name} has reconnected.`
          ) : session.status === 'newPlayer' ? (
            <label htmlFor="new-player-name">Enter your player name:</label>
          ) : session.status === 'requestingNewGame' ? (
            `Asking ${game.getOtherPlayer(game.requestingPlayer).name} to play again...`
          ) : session.status === 'newGameRequested' ? (
            `${game.requestingPlayer.name} asks to play again.`
          ) : game.players.length === 0 ? (
            'Welcome! How many players?'
          ) : game.currentPlayer ? (
            `${game.currentPlayer.name}, your turn!`
          ) : game.winner ? (
            `${game.winner.name} wins! Play again?`
          ) : game.grid.checkIfFull() ? (
            "We'll call it a draw! Play again?"
          ) : !session.socket && game.type !== null ? (
            'Which player should start first?'
          ) : roomCode && game.requestingPlayer ? (
            `${game.requestingPlayer.name} has ended the game.`
          ) : session.status === 'waitingForPlayers' ? (
            'Waiting for other player...'
          ) : (
            'Game ended. Play again?'
          )}
        </p>
        <DashboardControlsComponent game={game} session={session} roomCode={roomCode} />
      </div>
    );
  }
}

export default DashboardComponent;

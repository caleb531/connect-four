/* global ga, gtag */
import m from 'mithril';

class DashboardControlsComponent {
  oninit({ attrs: { game, session } }) {
    this.game = game;
    this.session = session;
  }

  // Prepare game players by creating new players (if necessary) and deciding
  // which player has the starting move
  setPlayers(gameType) {
    if (this.game.players.length > 0) {
      // Reset new games before choosing number of players (no need to reset
      // the very first game)
      this.game.resetGame();
    }
    this.game.setPlayers(gameType);
  }

  startGame(newStartingPlayer) {
    this.game.startGame({
      startingPlayer: newStartingPlayer
    });
  }

  endGame(roomCode) {
    if (roomCode) {
      // The local player ID and room code will be automatically passed by the
      // session.emit() function
      this.session.emit('end-game');
    } else {
      this.game.endGame();
    }
  }

  returnToHome() {
    this.session.disconnect();
    // Redirect to homepage and clear all app state
    window.location.href = '/';
  }

  closeRoom() {
    this.session.status = 'closingRoom';
    this.session.emit('close-room', {}, () => {
      this.returnToHome();
    });
  }

  declineNewGame() {
    this.session.status = 'decliningNewGame';
    this.session.emit('decline-new-game', {}, () => {
      this.returnToHome();
    });
  }

  leaveRoom() {
    this.session.status = 'leavingRoom';
    this.returnToHome();
  }

  promptToStartOnlineGame() {
    this.session.status = 'newPlayer';
    this.setPlayers({ gameType: 'online' });
  }

  setNewPlayerName(inputEvent) {
    this.newPlayerName = inputEvent.target.value.trim();
    inputEvent.redraw = false;
  }

  submitNewPlayer(submitEvent, roomCode) {
    submitEvent.preventDefault();
    if (roomCode) {
      this.addNewPlayerToGame(roomCode);
    } else {
      this.startOnlineGame();
    }
  }

  addNewPlayerToGame(roomCode) {
    this.session.status = 'connecting';
    const submittedPlayer = { name: this.newPlayerName, color: 'blue' };
    this.session.emit(
      'add-player',
      { roomCode, player: submittedPlayer },
      ({ game, localPlayer }) => {
        this.game.restoreFromServer({ game, localPlayer });
        m.redraw();
      }
    );
  }

  startOnlineGame() {
    this.session.connect();
    // Construct a placeholder player with the name we entered and the default
    // first player color
    const submittedPlayer = { name: this.newPlayerName, color: 'red' };
    // Request a new room and retrieve the room code returned from the server
    this.session.emit(
      'open-room',
      { player: submittedPlayer },
      ({ roomCode, game, localPlayer }) => {
        this.game.restoreFromServer({ game, localPlayer });
        m.route.set(`/room/${roomCode}`);
      }
    );
  }

  requestNewOnlineGame() {
    this.session.status = 'connecting';
    this.session.emit('request-new-game', { winner: this.game.winner }, ({ localPlayer }) => {
      if (this.session.status === 'requestingNewGame') {
        this.game.requestingPlayer = localPlayer;
      }
      m.redraw();
    });
  }

  view({ attrs: { roomCode } }) {
    return (
      <div id="dashboard-controls">
        {this.session.status === 'newPlayer' ? (
          <form action onsubmit={(submitEvent) => this.submitNewPlayer(submitEvent, roomCode)}>
            <input
              type="text"
              autoComplete="off"
              id="new-player-name"
              name="new-player-name"
              autoFocus
              required
              oninput={(inputEvent) => this.setNewPlayerName(inputEvent)}
            />
            <button type="submit">{roomCode ? 'Join Game' : 'Start Game'}</button>
            {!roomCode ? (
              <a className="go-back" href="/">
                Back
              </a>
            ) : null}
          </form>
        ) : this.session.status === 'waitingForPlayers' ? (
          <div id="share-controls">
            <input
              type="text"
              readOnly
              id="share-link"
              value={window.location.href}
              onclick={({ target }) => target.select()}
            />
            <button
              id="copy-share-link"
              onclick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy
            </button>
          </div>
        ) : this.game.inProgress &&
          this.session.status !== 'watchingGame' &&
          !this.session.disconnected ? (
          <button className="warn" onclick={() => this.endGame(roomCode)}>
            End Game
          </button>
        ) : !this.game.inProgress &&
          this.session.status !== 'watchingGame' &&
          !this.session.disconnected &&
          this.session.disconnectedPlayer ? (
          <button className="warn" onclick={() => this.leaveRoom()}>
            Leave Room
          </button>
        ) : this.session.status === 'roomNotFound' ? (
          <button onclick={() => this.returnToHome()}>Return to Home</button>
        ) : this.session.socket &&
          this.game.players.length === 2 &&
          this.session.status !== 'connecting' &&
          this.session.status !== 'watchingGame' &&
          !this.session.disconnectedPlayer &&
          !this.session.reconnectedPlayer &&
          !this.session.disconnected ? (
          <>
            <button
              onclick={() => this.requestNewOnlineGame()}
              disabled={this.session.status === 'requestingNewGame'}
            >
              {this.session.status === 'newGameRequested'
                ? 'Yes!'
                : this.session.status === 'requestingNewGame'
                  ? 'Pending'
                  : 'Play Again'}
            </button>
            {this.session.status !== 'requestingNewGame' ? (
              <button
                className="warn"
                onclick={() => this.declineNewGame()}
                disabled={this.session.status === 'requestingNewGame'}
              >
                {this.session.status === 'newGameRequested'
                  ? 'Nah'
                  : this.session.status !== 'requestingNewGame'
                    ? 'No Thanks'
                    : null}
              </button>
            ) : null}
          </>
        ) : !this.session.socket ? (
          this.game.type !== null ? (
            <>
              {this.game.players.map((player) => (
                <button onclick={() => this.startGame(player)}>{player.name}</button>
              ))}
              <a className="go-back" href="/">
                Back
              </a>
            </>
          ) : (
            <>
              <button onclick={() => this.setPlayers({ gameType: '1P' })}>1 Player</button>
              <button onclick={() => this.promptToStartOnlineGame()}>2 Players</button>
            </>
          )
        ) : null}
      </div>
    );
  }
}

export default DashboardControlsComponent;

import m from 'mithril';
import ClipboardJS from 'clipboard';

// The area of the game UI consisting of game UI controls and status messages
class DashboardComponent {

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

  createNewPlayer() {
    this.session.status = 'newPlayer';
  }

  setNewPlayerName(inputEvent) {
    this.newPlayerName = inputEvent.target.value;
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
    let submittedPlayer = { name: this.newPlayerName, color: 'blue' };
    this.session.emit('add-player', { roomCode, player: submittedPlayer }, ({ game, localPlayer }) => {
      this.game.restoreFromServer({ game, localPlayer });
      m.redraw();
    });
  }

  startOnlineGame() {
    this.session.connect();
    // Construct a placeholder player with the name we entered and the default
    // first player color
    let submittedPlayer = { name: this.newPlayerName, color: 'red' };
    // Request a new room and retrieve the room code returned from the server
    this.session.emit('open-room', { player: submittedPlayer }, ({ roomCode, game, localPlayer }) => {
      this.game.restoreFromServer({ game, localPlayer });
      console.log('new room', roomCode);
      m.route.set(`/room/${roomCode}`);
    });
  }

  requestNewOnlineGame() {
    this.session.emit('request-new-game', { winner: this.game.winner }, ({ localPlayer }) => {
      console.log(this.session.status);
      this.game.requestingPlayer = localPlayer;
      m.redraw();
    });
  }

  configureCopyControl({ dom }) {
    this.shareLinkCopier = new ClipboardJS(dom);
  }

  view({ attrs: { roomCode } }) {
    return m('div#game-dashboard', [
      m('p#game-message',
        // If the current player needs to enter a name
        this.session.status === 'newPlayer' ?
          'Enter your player name:' :
        this.session.status === 'waitingForPlayers' ?
          [
            'Waiting for other player...',
            m('div#share-controls', [
              m('input[type=text]#share-link', {
                value: window.location.href,
                onclick: ({ target }) => target.select()
              }),
              m('button#copy-share-link', {
                'data-clipboard-text': window.location.href,
                oncreate: ({ dom }) => this.configureCopyControl({ dom })
              }, 'Copy')
            ])
          ] :
        this.session.status === 'connecting' ?
          'Connecting to server...' :
        this.session.status === 'roomNotFound' ?
          'This room does not exist.' :
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
        // Otherwise, if game was ended manually by the user
        'Game ended. Play again?'
      ),
      // If game is in progress, allow user to end game at any time
      this.game.inProgress ? [
        m('button', { onclick: () => this.endGame(roomCode) }, 'End Game')
      ] :
      // If an online game is not in progress (i.e. it was ended early, or there
      // is a winner/tie), allow the user to play again
      this.session.socket && this.game.players.length === 2 ? m('button', {
        onclick: () => this.requestNewOnlineGame(),
        disabled: this.session.status === 'requestingNewGame'
      }, this.session.status === 'requestingNewGame' ? 'Pending' : 'Play Again') :
      this.session.status === 'newPlayer' ? [
        m('form', {
          onsubmit: (submitEvent) => this.submitNewPlayer(submitEvent, roomCode)
        }, [
          m('input[type=text][autocomplete=off]#new-player-name', {
            name: 'new-player-name',
            autofocus: true,
            oninput: (inputEvent) => this.setNewPlayerName(inputEvent)
          }),
          m('button[type=submit]', roomCode ? 'Join Game' : 'Start Game')
        ])
      ] :
      !this.session.socket ? [
        // If number of players has been chosen, ask user to choose starting player
        this.game.type !== null ?
          this.game.players.map((player) => {
            return m('button', {
              onclick: () => this.startGame(player)
            }, player.name);
          }) :
          // Select a number of human players
          [
            m('button', {
              onclick: () => this.setPlayers({ gameType: '1P' })
            }, '1 Player'),
            m('button', {
              onclick: () => this.setPlayers({ gameType: '2P' })
            }, '2 Players'),
            m('button', {
              onclick: () => this.createNewPlayer()
            }, 'Online')
          ]
        ] : null
    ]);
  }

}

export default DashboardComponent;

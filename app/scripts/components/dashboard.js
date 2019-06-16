import m from 'mithril';

// The area of the game UI consisting of game UI controls and status messages
class DashboardComponent {

  oninit({ attrs: { game, session } }) {
    this.game = game;
    this.session = session;
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

  createNewPlayer() {
    this.session.status = 'new-player';
  }

  setNewPlayerName(inputEvent) {
    this.currentPlayerName = inputEvent.target.value;
    inputEvent.redraw = false;
  }

  submitNewPlayer(submitEvent) {
    submitEvent.preventDefault();
    this.startOnlineGame();
  }

  startOnlineGame() {
    this.session.status = 'connecting';
    this.game.setPlayers(2);
    this.game.players[0].name = this.currentPlayerName;
    this.session.connect();
    this.session.on('connect', () => {
      // Request a new room and retrieve the room code returned from the server
      this.session.emit('new-room', { player: this.game.players[0] }, ({ status, room, player }) => {
        this.session.status = status;
        console.log('new room', room.code);
        this.session.playerId = player.id;
        m.route.set(`/room/${room.code}`);
      });
    });
  }

  view({ attrs: { roomCode } }) {
    return m('div#game-dashboard', [
      m('p#game-message',
        // If the current player needs to enter a name
        this.session.status === 'new-player' ?
          'Enter your player name:' :
        this.session.status === 'waiting-for-players' ?
          'Waiting for other player...' :
        this.session.status === 'connecting' ?
          'Connecting to server...' :
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
        !this.session.status && this.game.humanPlayerCount !== null ?
          'Which player should start first?' :
        // Otherwise, if game was ended manually by the user
        'Game ended. Play again?'
      ),
      // If game is in progress, allow user to end game at any time
      this.game.inProgress ? [
        m('button', { onclick: () => this.endGame() }, 'End Game')
      ] :
      this.session.status === 'new-player' ? [
        m('form', {
          onsubmit: (submitEvent) => this.submitNewPlayer(submitEvent)
        }, [
          m('input[type=text]#new-player-name', {
            name: 'new-player-name',
            autofocus: true,
            oninput: (inputEvent) => this.setNewPlayerName(inputEvent)
          }),
          m('button[type=submit]', 'Start Game')
        ])
      ] :
      !this.session.status ? [
        // If number of players has been chosen, ask user to choose starting player
        this.game.humanPlayerCount !== null ?
          this.game.players.map((player) => {
            return m('button', {
              onclick: () => this.startGame(player)
            }, player.name);
          }) :
          // Select a number of human players
          !roomCode ? [
            m('button', {
              onclick: () => this.setPlayers(1)
            }, '1 Player'),
            m('button', {
              onclick: () => this.setPlayers(2)
            }, '2 Players'),
            m('button', {
              onclick: () => this.createNewPlayer()
            }, 'Online')
          ] : null
        ] : null
    ]);
  }

}

export default DashboardComponent;

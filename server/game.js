import Grid from './grid.js';

class Game {
  constructor({
    players,
    grid = new Grid({ columnCount: 7, rowCount: 6 }),
    startingPlayer = null,
    currentPlayer = null,
    requestingPlayer = null,
    inProgress = false,
    pendingChipColumn = null,
    winner = null,
    pendingNewGame = false
  }) {
    this.grid = grid;
    this.players = players;
    this.startingPlayer = startingPlayer;
    this.currentPlayer = currentPlayer;
    this.requestingPlayer = requestingPlayer;
    this.inProgress = inProgress;
    // The current column at which the pending chip is aligned on the client
    this.pendingChipColumn = pendingChipColumn;
    this.winner = winner;
    this.pendingNewGame = pendingNewGame;
  }

  startGame() {
    this.setStartingPlayer();
    this.currentPlayer = this.startingPlayer;
    this.inProgress = true;
  }

  endGame() {
    this.inProgress = false;
    this.currentPlayer = null;
  }

  resetGame() {
    this.winner = null;
    this.requestingPlayer = null;
    this.pendingNewGame = false;
    this.grid.resetGrid();
  }

  setStartingPlayer() {
    // The first game for a room should choose Player 2 as the starting player,
    // as a courtesy because they are the guest
    if (this.startingPlayer === null) {
      this.startingPlayer = this.players[1];
    } else {
      this.startingPlayer = this.players.find(
        (player) => player.color !== this.startingPlayer.color
      );
    }
  }

  getOtherPlayer(basePlayer = this.currentPlayer) {
    return this.players.find((player) => player.color !== basePlayer.color);
  }

  placeChip({ column }) {
    if (this.currentPlayer) {
      this.grid.placeChip({
        column,
        player: this.currentPlayer.color
      });
      this.currentPlayer = this.getOtherPlayer();
    }
  }

  declareWinner() {
    const submittedWinners = this.players.map((player) => player.lastSubmittedWinner || {});
    this.winner = this.players.find((player) => {
      return (
        player.color === submittedWinners[0].color && player.color === submittedWinners[1].color
      );
    });
    if (this.winner) {
      this.winner.score += 1;
    }
    // Reset each player's last submitted winner
    this.players.forEach((player) => {
      player.lastSubmittedWinner = null;
    });
  }

  toJSON() {
    return {
      grid: this.grid,
      players: this.players,
      currentPlayer: this.currentPlayer ? this.currentPlayer.color : null,
      requestingPlayer: this.requestingPlayer ? this.requestingPlayer.color : null,
      inProgress: this.inProgress,
      pendingChipColumn: this.pendingChipColumn
    };
  }
}

export default Game;

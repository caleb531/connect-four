import random from 'random';

import Grid from './grid.js';

class Game {

  constructor({ players, grid = new Grid({ columnCount: 7, rowCount: 6 }), startingPlayer = null, currentPlayer = null, requestingPlayer = null, inProgress = false, winner = null }) {
    this.grid = grid;
    this.players = players;
    this.startingPlayer = startingPlayer;
    this.currentPlayer = currentPlayer;
    this.requestingPlayer = requestingPlayer;
    this.inProgress = inProgress;
    this.pendingChipColumn = null;
    this.winner = winner;
    this.pendingNewGame = false;
  }

  startGame() {
    this.setStartingPlayer();
    this.currentPlayer = this.startingPlayer;
    this.inProgress = true;
  }

  endGame() {
    if (this.winner) {
      this.winner.score += 1;
    }
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
    // The first game for a room should pick a starting player at random;
    // successive games will alternate starting player
    if (this.startingPlayer === null) {
      this.startingPlayer = this.players[random.int(0, this.players.length - 1)];
    } else {
      this.startingPlayer = this.players.find((player) => player !== this.startingPlayer);
    }
  }

  getOtherPlayer(basePlayer = this.currentPlayer) {
    return this.players.find((player) => player !== basePlayer);
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
    let submittedWinners = this.players.map((player) => player.lastSubmittedWinner || {});
    this.winner = this.players.find((player) => {
      return player.color === submittedWinners[0].color && player.color === submittedWinners[1].color;
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

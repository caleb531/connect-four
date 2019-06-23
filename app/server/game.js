import random from 'random';

import Grid from './grid.js';

class Game {

  constructor({ players, grid = new Grid({ columnCount: 7, rowCount: 6 }), startingPlayer = null, currentPlayer = null, inProgress = false, winner = null }) {
    this.grid = grid;
    this.players = players;
    this.startingPlayer = startingPlayer;
    this.currentPlayer = currentPlayer;
    this.inProgress = inProgress;
    this.winner = winner;
  }

  startGame({ startingPlayer }) {
    this.startingPlayer = this.getStartingPlayer();
    this.currentPlayer = startingPlayer;
    this.inProgress = true;
  }

  endGame() {
    if (this.winner) {
      this.winner.score += 1;
    }
    this.inProgress = false;
  }

  getStartingPlayer() {
    // The first game for a room should pick a starting player at random;
    // successive games will alternate starting player
    if (this.startingPlayer === null) {
      this.startingPlayer = this.players[random.int(0, this.players.length - 1)];
    } else {
      this.startingPlayer = this.players.find((player) => player !== this.startingPlayer);
    }
  }

  getOtherPlayer() {
    return this.players.find((player) => player !== this.currentPlayer);
  }

  placeChip({ column }) {
    if (this.currentPlayer) {
      this.grid.placeChip({
        column,
        color: this.currentPlayer.color
      });
    }
  }

  toJSON() {
    return {
      grid: this.grid,
      players: this.players,
      currentPlayer: this.currentPlayer ? this.currentPlayer.color : null,
      inProgress: this.inProgress
    };
  }

}

export default Game;

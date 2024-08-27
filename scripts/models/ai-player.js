import Grid from './grid.js';
import AsyncPlayer from './async-player.js';
import Chip from './chip.js';

// An AI player that can think for itself
class AIPlayer extends AsyncPlayer {
  // Compute the column where the AI player should place its next chip
  async getNextMove({ game }) {
    return this.maximizeMove({
      grid: game.grid,
      // The minimizing player (from the perspetive of the AI player) is the
      // human player
      minPlayer: game.getOtherPlayer(this),
      // Initial depth at which to search future permutations of game states;
      // this depth will count up to thix.maxComputeDepth
      depth: 0,
      alpha: Grid.minScore,
      beta: Grid.maxScore
    });
  }

  // Choose a column that will maximize the AI player's chances of winning
  maximizeMove({ grid, minPlayer, depth, alpha, beta }) {
    const gridScore = grid.getScore({
      currentPlayer: this,
      currentPlayerIsMaxPlayer: true
    });
    // If max search depth was reached or if winning grid was found
    if (depth === this.maxComputeDepth || Math.abs(gridScore) === Grid.maxScore) {
      return { column: null, score: gridScore };
    }
    const maxMove = { column: null, score: Grid.minScore };
    for (let c = 0; c < grid.columnCount; c += 1) {
      // Continue to next possible move if this column is full
      if (grid.columns[c].length === grid.rowCount) {
        continue;
      }
      // Clone the current grid and place a chip to generate a new permutation
      const nextGrid = new Grid(grid);
      nextGrid.placeChip({
        column: c,
        chip: new Chip({ player: this })
      });
      // Minimize the opponent human player's chances of winning
      const minMove = this.minimizeMove({
        grid: nextGrid,
        minPlayer,
        depth: depth + 1,
        alpha,
        beta
      });
      // If a move yields a lower opponent score, make it the tentative max move
      if (minMove.score > maxMove.score) {
        maxMove.column = c;
        maxMove.score = minMove.score;
        alpha = minMove.score;
      } else if (maxMove.score === Grid.minScore) {
        // Ensure that the AI always blocks an opponent win even if the opponent
        // is guaranteed to win on its next turn
        maxMove.column = minMove.column;
        maxMove.score = minMove.score;
        alpha = minMove.score;
      }
      // Stop if there are no moves better than the current max move
      if (alpha >= beta) {
        break;
      }
    }
    return maxMove;
  }

  // Choose a column that will minimize the human player's chances of winning
  minimizeMove({ grid, minPlayer, depth, alpha, beta }) {
    const gridScore = grid.getScore({
      currentPlayer: minPlayer,
      currentPlayerIsMaxPlayer: false
    });
    // If max search depth was reached or if winning grid was found
    if (depth === this.maxComputeDepth || Math.abs(gridScore) === Grid.maxScore) {
      return { column: null, score: gridScore };
    }
    const minMove = { column: null, score: Grid.maxScore };
    for (let c = 0; c < grid.columnCount; c += 1) {
      // Continue to next possible move if this column is full
      if (grid.columns[c].length === grid.rowCount) {
        continue;
      }
      const nextGrid = new Grid(grid);
      // The human playing against the AI is always the first player
      nextGrid.placeChip({
        column: c,
        chip: new Chip({ player: minPlayer })
      });
      // Maximize the AI player's chances of winning
      const maxMove = this.maximizeMove({
        grid: nextGrid,
        minPlayer,
        depth: depth + 1,
        alpha,
        beta
      });
      // If a move yields a higher AI score, make it the tentative max move
      if (maxMove.score < minMove.score) {
        minMove.column = c;
        minMove.score = maxMove.score;
        beta = maxMove.score;
      }
      // Stop if there are no moves better than the current min move
      if (alpha >= beta) {
        break;
      }
    }
    return minMove;
  }
}

AIPlayer.prototype.type = 'ai';
// The duration to wait (in ms) for the user to process the AI player's actions
AIPlayer.prototype.waitDelay = 200;
// The maximum number of grid moves to look ahead; for reasons unknown,
// increasing this to a value greater than 3 will actually cripple the AI's
// ability to handle connect-three trap scenarios
AIPlayer.prototype.maxComputeDepth = 3;

export default AIPlayer;

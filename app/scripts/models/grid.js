import _ from 'underscore';

class Grid {

  // The state of a particular game grid
  constructor({ columnCount, rowCount, columns, lastPlacedChip }) {
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    // If existing grid object is passed to constructor, copy it
    if (columns) {
      // The columns array where columns containing placed chips are stored
      this.columns = columns.map((column) => {
        return column.slice(0);
      });
      this.lastPlacedChip = lastPlacedChip;
    } else {
      this.columns = _.times(this.columnCount, () => {
        return [];
      });
      this.lastPlacedChip = null;
    }
  }

  // Return true if the grid is completely full; otherwise, return false
  checkIfFull() {
    let grid = this;
    return grid.columns.every((column) => {
      return column.length === grid.rowCount;
    });
  }

  // Return the total number of chips currently placed on the grid
  getChipCount() {
    return this.columns.reduce((sum, column) => {
      return sum + column.length;
    }, 0);
  }

  // Reset the grid by removing all placed chips
  resetGrid() {
    this.columns.forEach((column) => {
      column.length = 0;
    });
    this.lastPlacedChip = null;
  }

  // Return the index of the next available slot for the given column
  getNextAvailableSlot({ column }) {
    let nextRowIndex = this.columns[column].length;
    if (nextRowIndex < this.rowCount) {
      return nextRowIndex;
    } else {
      // Return null if there are no more available slots in this column
      return null;
    }
  }

  // Place the given chip into the specified column on the grid
  placeChip({ chip, column }) {
    this.columns[column].push(chip);
    this.lastPlacedChip = chip;
    chip.column = column;
    chip.row = this.columns[column].length - 1;
  }

  // Find same-color neighbors connected to the given chip in the given direction
  getConnection(baseChip, direction) {
    let neighbor = baseChip;
    let connection = [];
    while (true) {
      let nextColumn = neighbor.column + direction.x;
      // Stop if the left/right edge of the grid has been reached
      if (this.columns[nextColumn] === undefined) {
        break;
      }
      let nextRow = neighbor.row + direction.y;
      let nextNeighbor = this.columns[nextColumn][nextRow];
      // Stop if the top/bottom edge of the grid has been reached or if the
      // neighboring slot is empty
      if (nextNeighbor === undefined) {
        break;
      }
      // Stop if this neighbor is not the same color as the original chip
      if (nextNeighbor.player !== baseChip.player) {
        break;
      }
      // Assume at this point that this neighbor chip is connected to the original
      // chip in the given direction
      neighbor = nextNeighbor;
      connection.push(nextNeighbor);
    }
    return connection;
  }

  // Get all connections of four chips (including connections of four within
  // larger connections) which the last placed chip is apart of
  getConnections({ baseChip, connectionSize }) {
    let grid = this;
    let connections = [];
    // Use a native 'for' loop to maximize performance because the AI player will
    // invoke this function many, many times
    for (let d = 0; d < Grid.connectionDirections.length; d += 1) {
      let direction = Grid.connectionDirections[d];
      let connection = [baseChip];
      // Check for connected neighbors in this direction
      connection.push(...grid.getConnection(baseChip, direction));
      // Check for connected neighbors in the opposite direction
      connection.push(...grid.getConnection(baseChip, {
        x: -direction.x,
        y: -direction.y
      }));
      if (connection.length >= connectionSize) {
        connections.push(connection);
      }
    }
    return connections;
  }

  // Calculate the intermediate grid score for the current slot, assuming neither
  // player has won yet
  getIntermediateScore({ currentPlayer, currentPlayerIsMaxPlayer, c, r }) {
    let gridScore = 0;
    // Search for current player's connections of one or more chips that are
    // connected to the empty slot
    let connections = this.getConnections({
      // Treat the empty slot as a chip to appease the algorithm
      baseChip: { column: c, row: r, player: currentPlayer },
      connectionSize: 2
    });
    // Sum up connections, giving exponentially more weight to larger connections
    for (let i = 0; i < connections.length; i += 1) {
      gridScore += Math.pow(connections[i].length, 2);
    }
    // Negate the grid score for any advantage the minimizing player has (as this
    // is considered a disadvantage to the maximizing player)
    if (!currentPlayerIsMaxPlayer) {
      gridScore *= -1;
    }
    return gridScore;
  }

  // Check the grid for winning connections are return the max or min score if a
  // player won (depending on who the current player is)
  getWinningScore({ currentPlayer, currentPlayerIsMaxPlayer, c, r }) {
    let gridScore;
    // Only check for winning connections by the current player
    if (this.columns[c][r].player !== currentPlayer) {
      return null;
    }
    let connections = this.getConnections({
      baseChip: this.columns[c][r],
      connectionSize: 4
    });
    if (connections.length >= 1) {
      if (currentPlayerIsMaxPlayer) {
        // The maximizing player wins
        gridScore = Grid.maxScore;
      } else {
        // The minimizing player wins
        gridScore = Grid.minScore;
      }
      return gridScore;
    }
    return null;
  }

  // Compute the grid's heuristic score for use by the AI player
  getScore({ currentPlayer, currentPlayerIsMaxPlayer }) {
    let gridScore = 0;
    let c, r;
    // Use native for loops instead of forEach because the function will need to
    // return immediately if a winning connection is found (there is no clean way
    // to break out of forEach)
    for (c = 0; c < this.columnCount; c += 1) {
      for (r = 0; r < this.rowCount; r += 1) {
        // If grid slot is empty
        if (this.columns[c][r] === undefined) {
          // Calculate the score normally assuming neither player has won yet
          gridScore += this.getIntermediateScore({ currentPlayer, currentPlayerIsMaxPlayer, c, r });
        } else {
          // Give player the maximum/minimum score if a connection of four or more
          // is found
          let winningScore = this.getWinningScore({ currentPlayer, currentPlayerIsMaxPlayer, c, r });
          if (winningScore) {
            return winningScore;
          }
        }
      }
    }
    return gridScore;
  }

}

// The relative directions to check when checking for connected chip neighbors
Grid.connectionDirections = [
  { x: 0, y: -1 }, // Bottom-middle
  { x: -1, y: -1 }, // Bottom-left
  { x: -1, y: 0 }, // Left-middle
  { x: -1, y: 1 } // Top-left
];

// The maximum grid score possible (awarded for winning connections by the
// maximizing player)
Grid.maxScore = Infinity;
// The minimum grid score possible (awarded for winning connections by the
// minimizing player)
Grid.minScore = -Grid.maxScore;

export default Grid;

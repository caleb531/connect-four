import _ from 'underscore';

class Grid {

  // The state of a particular game grid
  constructor({ columnCount, rowCount, columns, lastPlacedChip = null }) {
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    // If existing grid object is passed to constructor, copy it
    if (columns) {
      // The columns array where columns containing placed chips are stored
      this.columns = columns.map((column) => column.slice(0));
    } else {
      this.columns = _.times(this.columnCount, () => []);
    }
    this.lastPlacedChip = lastPlacedChip;
  }

  // Return true if the grid is completely full; otherwise, return false
  checkIfFull() {
    let grid = this;
    return grid.columns.every((column) => column.length === grid.rowCount);
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
  getSubConnection(baseChip, direction) {
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
        if (nextRow >= 0 && nextRow < this.rowCount) {
          //
          connection.hasEmptySlot = true;
        }
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

  // Add a sub-connection (in the given direction) to a larger connection
  addSubConnection(connection, baseChip, direction) {
    var subConnection = this.getSubConnection(baseChip, direction);
    connection.push(...subConnection);
    if (subConnection.hasEmptySlot) {
      connection.emptySlotCount += 1;
    }
  }

  // Get all connections of four chips (including connections of four within
  // larger connections) which the last placed chip is apart of
  getConnections({ baseChip, minConnectionSize }) {
    let connections = [];
    // Use a native 'for' loop to maximize performance because the AI player will
    // invoke this function many, many times
    for (let d = 0; d < Grid.connectionDirections.length; d += 1) {
      let direction = Grid.connectionDirections[d];
      let connection = [baseChip];
      connection.emptySlotCount = 0;
      // Check for connected neighbors in this direction
      this.addSubConnection(connection, baseChip, direction);
      // Check for connected neighbors in the opposite direction
      this.addSubConnection(connection, baseChip, {
        x: -direction.x,
        y: -direction.y
      });
      if (connection.length >= minConnectionSize) {
        connections.push(connection);
      }
    }
    return connections;
  }

  // Score connections connected to the given chip; the chip is assumed to
  // belong to the current player
  getChipScore({ chip, currentPlayerIsMaxPlayer }) {
    let gridScore = 0;
    // Search for current player's connections of one or more chips that are
    // connected to the empty slot
    let connections = this.getConnections({
      // Treat the empty slot as a chip to appease the algorithm
      baseChip: chip,
      minConnectionSize: 1
    });
    // Sum up connections, giving exponentially more weight to larger connections
    for (let i = 0; i < connections.length; i += 1) {
      var connection = connections[i];
      if (connection.length >= 4) {
        return (currentPlayerIsMaxPlayer ? Grid.maxScore : Grid.minScore);
      } else if (connection.emptySlotCount >= 1) {
        gridScore += Math.pow(connection.length, 2) + Math.pow(connection.emptySlotCount, 3);
      }
    }
    // Negate the grid score for any advantage the minimizing player has (as this
    // is considered a disadvantage to the maximizing player)
    if (!currentPlayerIsMaxPlayer) {
      gridScore *= -1;
    }
    return gridScore;
  }

  // Compute the grid's heuristic score for use by the AI player
  getScore({ currentPlayer, currentPlayerIsMaxPlayer }) {
    let gridScore = 0;
    let c, r;
    // Use native for loops instead of forEach because the function will need to
    // return immediately if a winning connection is found (there is no clean way
    // to break out of forEach)
    for (c = 0; c < this.columns.length; c += 1) {
      for (r = 0; r < this.columns[c].length; r += 1) {
        let chip = this.columns[c][r];
        if (chip.player !== currentPlayer) {
          continue;
        }
        let score = this.getChipScore({ currentPlayer, currentPlayerIsMaxPlayer, chip });
        if (Math.abs(score) === Grid.maxScore) {
          return score;
        } else {
          gridScore += score;
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

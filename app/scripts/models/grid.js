'use strict';

var _ = require('underscore');

// The state of a particular game grid
function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  // If existing grid object is passed to constructor, copy it
  if (args instanceof Grid) {
    // The columns array where columns containing placed chips are stored
    this.columns = args.columns.map(function (column) {
      return column.slice(0);
    });
  } else {
    this.columns = [];
    this.resetGrid();
  }
}

// Return true if the grid is completely full; otherwise, return false
Grid.prototype.checkIfFull = function () {
  var grid = this;
  return _.every(grid.columns, function (column) {
    return column.length === grid.rowCount;
  });
};

// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};

// Return the index of the next available slot for the given column
Grid.prototype.getNextAvailableSlot = function (args) {
  var nextRowIndex = this.columns[args.column].length;
  if (nextRowIndex < this.rowCount) {
    return nextRowIndex;
  } else {
    // Return null if there are no more available slots in this column
    return null;
  }
};

// Place the given chip into the specified column on the grid
Grid.prototype.placeChip = function (args) {
  this.columns[args.column].push(args.chip);
  args.chip.column = args.column;
  args.chip.row = this.columns[args.column].length - 1;
};

// Find same-color neighbors connected to the given chip in the given direction
Grid.prototype.getConnection = function (baseChip, direction) {
  var neighbor = baseChip;
  var connection = [];
  while (true) {
    var nextColumn = neighbor.column + direction.x;
    // Stop if the left/right edge of the grid has been reached
    if (this.columns[nextColumn] === undefined) {
      break;
    }
    var nextRow = neighbor.row + direction.y;
    var nextNeighbor = this.columns[nextColumn][nextRow];
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
};

// Get all connections of four chips (including connections of four within
// larger connections) which the last placed chip is apart of
Grid.prototype.getConnections = function (args) {
  var grid = this;
  var connections = [];
  Grid.connectionDirections.forEach(function (direction) {
    var connection = [args.baseChip];
    // Check for connected neighbors in this direction
    connection.push.apply(
      connection,
      grid.getConnection(args.baseChip, direction)
    );
    // Check for connected neighbors in the opposite direction
    connection.push.apply(
      connection,
      grid.getConnection(args.baseChip, {
        x: -direction.x,
        y: -direction.y
      })
    );
    if (connection.length >= args.connectionSize) {
      connections.push(connection);
    }
  });
  return connections;
};

// The relative directions to check when checking for connected chip neighbors
Grid.connectionDirections = [
  {x: 0, y: -1}, // Bottom-middle
  {x: -1, y: -1}, // Bottom-left
  {x: -1, y: 0}, // Left-middle
  {x: -1, y: 1} // Top-left
];

// Compute the grid's heuristic score for use by the AI player
Grid.prototype.getScore = function (args) {
  var gridScore = 0;
  var connections;
  var c, r, i;
  // The heuristic function needs to be fast, so use native loops
  for (c = 0; c < this.columnCount; c += 1) {
    for (r = 0; r < this.rowCount; r += 1) {
      // If grid slot is empty
      if (this.columns[c][r] === undefined) {
        // Search for current player's connections of one or more chips that are
        // connected to the empty slot
        connections = this.getConnections({
          // Treat the empty slot as a chip to appease the algorithm
          baseChip: {column: c, row: r, player: args.currentPlayer},
          connectionSize: 2
        });
        for (i = 0; i < connections.length; i += 1) {
          if (args.currentPlayerIsMaxPlayer) {
            // Add to the grid score for every advantage the AI has
            gridScore += Math.pow(connections[i].length, 2);
          } else {
            // Subtract from the grid score for every advantage the human
            // opponent has
            gridScore -= Math.pow(connections[i].length, 2);
          }
        }
      } else {
        // Give player the maximum/minimum score if a connection of four or more
        // is found
        connections = this.getConnections({
          baseChip: this.columns[c][r],
          connectionSize: 4
        });
        if (connections.length >= 1 && this.columns[c][r].player === args.currentPlayer) {
          if (args.currentPlayerIsMaxPlayer) {
            // The AI wins
            gridScore = Grid.maxScore;
          } else {
            // The human opponent wins
            gridScore = Grid.minScore;
          }
          return gridScore;
        }
      }
    }
  }
  return gridScore;
};

Grid.maxScore = 1000;
Grid.minScore = -Grid.maxScore;

module.exports = Grid;

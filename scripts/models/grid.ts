import _ from 'underscore';
import GridConnection from './grid-connection.js';
import Chip from './chip';
import type Player from './player';
import { Direction } from './grid.d';

class Grid {

  columnCount: number;
  rowCount: number;
  columns: Chip[][];
  lastPlacedChip: Chip | null;
  static maxScore: typeof Number.POSITIVE_INFINITY;
  static minScore: typeof Number.NEGATIVE_INFINITY;

  // The state of a particular game grid
  constructor({ columnCount, rowCount, columns, lastPlacedChip = null }: Grid) {
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
    return this.columns.every((column) => column.length === this.rowCount);
  }

  // Return the total number of chips currently placed on the grid
  getChipCount() {
    return this.columns.reduce((sum, column) => sum + column.length, 0);
  }

  // Reset the grid by removing all placed chips
  resetGrid() {
    this.columns.forEach((column) => {
      column.length = 0;
    });
    this.lastPlacedChip = null;
  }

  // Return the index of the next available slot for the given column
  getNextAvailableSlot({ column }: { column: number }): number | null {
    const nextRowIndex = this.columns[column].length;
    if (nextRowIndex < this.rowCount) {
      return nextRowIndex;
    } else {
      // Return null if there are no more available slots in this column
      return null;
    }
  }

  // Place the given chip into the specified column on the grid
  placeChip({ chip, column }: { chip: Chip, column: number }) {
    this.columns[column].push(chip);
    this.lastPlacedChip = chip;
    chip.column = column;
    chip.row = this.columns[column].length - 1;
  }

  // Find same-color neighbors connected to the given chip in the given direction
  getSubConnection(baseChip: Chip, direction: Direction) {
    let neighbor = baseChip;
    const subConnection = new GridConnection();
    while (true) {
      const nextColumn = neighbor.column + direction.x;
      // Stop if the left/right edge of the grid has been reached
      if (this.columns[nextColumn] === undefined) {
        break;
      }
      const nextRow = neighbor.row + direction.y;
      const nextNeighbor = this.columns[nextColumn][nextRow];
      // Stop if the top/bottom edge of the grid has been reached or if the
      // neighboring slot is empty
      if (nextNeighbor === undefined) {
        if (nextRow >= 0 && nextRow < this.rowCount) {
          subConnection.emptySlotCount += 1;
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
      subConnection.addChip(nextNeighbor);
    }
    return subConnection;
  }

  // Add a sub-connection (in the given direction) to a larger connection
  addSubConnection(connection: GridConnection, baseChip: Chip, direction: Direction): void {
    const subConnection = this.getSubConnection(baseChip, direction);
    connection.addConnection(subConnection);
  }

  // Get all connections of four chips (including connections of four within
  // larger connections) which the last placed chip is apart of
  getConnections({ baseChip, minConnectionSize }: { baseChip: Chip, minConnectionSize: number }) {
    const connections: GridConnection[] = [];
    GridConnection.directions.forEach((direction) => {
      const connection = new GridConnection({ chips: [baseChip] });
      // Check for connected neighbors in this direction
      this.addSubConnection(connection, baseChip, direction);
      // Check for connected neighbors in the opposite direction
      this.addSubConnection(connection, baseChip, {
        x: -direction.x as Direction['x'],
        y: -direction.y as Direction['y']
      });
      if (connection.length >= minConnectionSize) {
        connections.push(connection);
      }
    });
    return connections;
  }

  // Score connections connected to the given chip; the chip is assumed to
  // belong to the current player
  getChipScore({ chip, currentPlayerIsMaxPlayer }: { chip: Chip, currentPlayerIsMaxPlayer: boolean }) {
    let gridScore = 0;
    // Search for current player's connections of one or more chips that are
    // connected to the empty slot
    const connections = this.getConnections({
      // Treat the empty slot as a chip to appease the algorithm
      baseChip: chip,
      minConnectionSize: 1
    });
    // Sum up connections, giving exponentially more weight to larger connections
    for (let i = 0; i < connections.length; i += 1) {
      const connection = connections[i];
      if (connection.length >= 4) {
        gridScore = Grid.maxScore;
        break;
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
  getScore({ currentPlayer, currentPlayerIsMaxPlayer }: { currentPlayer: Player, currentPlayerIsMaxPlayer: boolean }) {
    let gridScore = 0;
    let c, r;
    // Use native for loops instead of forEach because the function will need to
    // return immediately if a winning connection is found (there is no clean way
    // to break out of forEach)
    for (c = 0; c < this.columns.length; c += 1) {
      for (r = 0; r < this.columns[c].length; r += 1) {
        const chip = this.columns[c][r];
        if (chip.player !== currentPlayer) {
          continue;
        }
        const score = this.getChipScore({ currentPlayerIsMaxPlayer, chip });
        if (Math.abs(score) === Grid.maxScore) {
          return score;
        } else {
          gridScore += score;
        }
      }
    }
    return gridScore;
  }

  restoreFromServer({ grid, players }: { grid: Grid, players: Player[] }) {
    const playersByColor = _.indexBy(players, 'color');
    this.columnCount = grid.columnCount;
    this.rowCount = grid.rowCount;
    this.columns = grid.columns.map((column) => {
      return column.map((chip) => {
        // To conserve space, the server only stores the player color on the
        // chip, rather than the player object itself; however, the client
        // expects Chip objects in the grid to have a direct reference to the
        // player object, so perform that conversion here
        return new Chip(Object.assign(chip, {
          player: playersByColor[chip.player]
        }));
      });
    });
    if (grid.lastPlacedChip) {
      this.lastPlacedChip = this.columns[grid.lastPlacedChip.column][grid.lastPlacedChip.row];
    } else {
      this.lastPlacedChip = null;
    }
  }

}

// The maximum grid score possible (awarded for winning connections by the
// maximizing player)
Grid.maxScore = Number.POSITIVE_INFINITY;
// The minimum grid score possible (awarded for winning connections by the
// minimizing player)
Grid.minScore = Number.NEGATIVE_INFINITY;

export default Grid;

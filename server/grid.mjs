import _ from 'underscore';

class Grid {

  // The state of a particular game grid
  constructor({ columnCount = 7, rowCount = 6, columns = _.times(columnCount, () => []), lastPlacedChip = null } = {}) {
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    this.columns = columns;
    this.lastPlacedChip = lastPlacedChip;
  }

   // Reset the grid by removing all placed chips
  resetGrid() {
    this.columns.forEach((column) => {
      column.length = 0;
    });
    this.lastPlacedChip = null;
  }

  // Place the given chip into the column defined on it
  placeChip(chip) {
    if (chip.column >= 0 && chip.column < this.columnCount && this.columns[chip.column].length < this.rowCount) {
      this.columns[chip.column].push(chip);
      this.lastPlacedChip = chip;
      chip.row = this.columns[chip.column].length - 1;
    }
  }

  toJSON() {
    return {
      columnCount: this.columnCount,
      rowCount: this.rowCount,
      columns: this.columns,
      lastPlacedChip: this.lastPlacedChip
    };
  }

}

export default Grid;

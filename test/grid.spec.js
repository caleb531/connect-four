import _ from 'underscore';
import Grid from '../app/scripts/models/grid.js';
import Player from '../app/scripts/models/player.js';
import Chip from '../app/scripts/models/chip.js';

describe('grid', function () {

  it('should initialize', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid.columnCount).to.equal(9);
    expect(grid.rowCount).to.equal(8);
    expect(grid.columns).to.have.length(9);
    grid.columns.forEach(function (column) {
      expect(column).to.have.length(0);
    });
    expect(grid).to.have.property('lastPlacedChip', null);
  });

  it('should be copiable', function () {
    let grid1 = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    let player = new Player({ color: 'red' });
    let chip = new Chip({ player: player });
    grid1.placeChip({ column: 3, chip: chip });
    let grid2 = new Grid(grid1);
    expect(grid2).to.have.property('columnCount', 9);
    expect(grid2).to.have.property('rowCount', 8);
    expect(grid2).to.have.property('columns');
    expect(grid2).to.have.property('lastPlacedChip', chip);
    expect(grid2.columns).not.to.equal(grid1.columns);
    expect(grid2.columns).to.have.length(9);
    expect(grid2.columns[3]).not.to.equal(grid1.columns[3]);
    expect(grid2.columns[3][0]).to.equal(chip);
  });

  it('should know when it is full', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    let player = new Player({ color: 'red', name: 'Bob' });
    _.times(9, function (c) {
      _.times(8, function () {
        grid.placeChip({ column: c, chip: new Chip({ player: player }) });
      });
    });
    expect(grid.checkIfFull()).to.be.true;
  });

  it('should know when it is not full', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    let player = new Player({ color: 'red', name: 'Bob' });
    _.times(9, function (c) {
      _.times(7, function () {
        grid.placeChip({ column: c, chip: new Chip({ player: player }) });
      });
    });
    expect(grid.checkIfFull()).to.be.false;
  });

  it('should count current number of chips when grid is empty', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid.getChipCount()).to.equal(0);
  });

  it('should count current number of chips', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    let player = new Player({ color: 'red', name: 'Bob' });
    _.times(6, function (c) {
      _.times(4, function () {
        grid.placeChip({ column: c, chip: new Chip({ player: player }) });
      });
    });
    expect(grid.getChipCount()).to.equal(24);
  });

  it('should reset', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    let player = new Player({ color: 'red', name: 'Bob' });
    _.times(9, function (c) {
      _.times(6, function () {
        grid.placeChip({ column: c, chip: new Chip({ player: player }) });
      });
    });
    grid.resetGrid();
    grid.columns.forEach(function (column) {
      expect(column).to.have.length(0);
    });
    expect(grid).to.have.property('lastPlacedChip', null);
  });

  it('should get next available slot in column', function () {
    let grid = new Grid({
      columnCount: 7,
      rowCount: 6
    });
    let player = new Player({ color: 'red', name: 'Bob' });
    _.times(6, function () {
      grid.placeChip({ column: 2, chip: new Chip({ player: player }) });
    });
    grid.placeChip({ column: 4, chip: new Chip({ player: player }) });
    expect(grid.getNextAvailableSlot({ column: 1 })).to.equal(0);
    expect(grid.getNextAvailableSlot({ column: 2 })).to.equal(null);
    expect(grid.getNextAvailableSlot({ column: 4 })).to.equal(1);
  });

  it('should place chip and set its column/row', function () {
    let grid = new Grid({
      columnCount: 9,
      rowCount: 6
    });
    let player1 = new Player({ color: 'red' });
    let player2 = new Player({ color: 'blue' });
    let chip1 = new Chip({ player: player1 });
    let chip2 = new Chip({ player: player2 });
    grid.placeChip({ column: 2, chip: chip1 });
    expect(grid.columns[2][0]).to.equal(chip1);
    expect(grid.columns[2][0]).to.have.property('column', 2);
    expect(grid.columns[2][0]).to.have.property('row', 0);
    expect(grid).to.have.property('lastPlacedChip', chip1);
    grid.placeChip({ column: 2, chip: chip2 });
    expect(grid.columns[2][1]).to.equal(chip2);
    expect(grid.columns[2][1]).to.have.property('column', 2);
    expect(grid.columns[2][1]).to.have.property('row', 1);
    expect(grid).to.have.property('lastPlacedChip', chip2);
  });

});

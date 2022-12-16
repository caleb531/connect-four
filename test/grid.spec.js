import { test, expect } from '@playwright/test';
import _ from 'underscore';
import Grid from '../app/scripts/models/grid.js';
import Player from '../app/scripts/models/player.js';
import Chip from '../app/scripts/models/chip.js';

test.describe('grid', async () => {

  test('should initialize', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid.columnCount).toEqual(9);
    expect(grid.rowCount).toEqual(8);
    expect(grid.columns).toHaveLength(9);
    grid.columns.forEach(function (column) {
      expect(column).toHaveLength(0);
    });
    expect(grid).toHaveProperty('lastPlacedChip', null);
  });

  test('should be copiable', async () => {
    const grid1 = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    const player = new Player({ color: 'red' });
    const chip = new Chip({ player });
    grid1.placeChip({ column: 3, chip });
    const grid2 = new Grid(grid1);
    expect(grid2).toHaveProperty('columnCount', 9);
    expect(grid2).toHaveProperty('rowCount', 8);
    expect(grid2).toHaveProperty('columns');
    expect(grid2).toHaveProperty('lastPlacedChip', chip);
    expect(grid2.columns).not.toBe(grid1.columns);
    expect(grid2.columns).toHaveLength(9);
    expect(grid2.columns[3]).not.toBe(grid1.columns[3]);
    expect(grid2.columns[3][0]).toEqual(chip);
  });

  test('should know when it is full', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    const player = new Player({ color: 'red', name: 'Bob' });
    _.times(9, function (c) {
      _.times(8, async () => {
        grid.placeChip({ column: c, chip: new Chip({ player }) });
      });
    });
    expect(grid.checkIfFull()).toBe(true);
  });

  test('should know when it is not full', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    const player = new Player({ color: 'red', name: 'Bob' });
    _.times(9, function (c) {
      _.times(7, async () => {
        grid.placeChip({ column: c, chip: new Chip({ player }) });
      });
    });
    expect(grid.checkIfFull()).toBe(false);
  });

  test('should count current number of chips when grid is empty', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid.getChipCount()).toEqual(0);
  });

  test('should count current number of chips', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    const player = new Player({ color: 'red', name: 'Bob' });
    _.times(6, function (c) {
      _.times(4, async () => {
        grid.placeChip({ column: c, chip: new Chip({ player }) });
      });
    });
    expect(grid.getChipCount()).toEqual(24);
  });

  test('should reset', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    const player = new Player({ color: 'red', name: 'Bob' });
    _.times(9, function (c) {
      _.times(6, async () => {
        grid.placeChip({ column: c, chip: new Chip({ player }) });
      });
    });
    grid.resetGrid();
    grid.columns.forEach(function (column) {
      expect(column).toHaveLength(0);
    });
    expect(grid).toHaveProperty('lastPlacedChip', null);
  });

  test('should get next available slot in column', async () => {
    const grid = new Grid({
      columnCount: 7,
      rowCount: 6
    });
    const player = new Player({ color: 'red', name: 'Bob' });
    _.times(6, async () => {
      grid.placeChip({ column: 2, chip: new Chip({ player }) });
    });
    grid.placeChip({ column: 4, chip: new Chip({ player }) });
    expect(grid.getNextAvailableSlot({ column: 1 })).toEqual(0);
    expect(grid.getNextAvailableSlot({ column: 2 })).toEqual(null);
    expect(grid.getNextAvailableSlot({ column: 4 })).toEqual(1);
  });

  test('should place chip and set its column/row', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 6
    });
    const player1 = new Player({ color: 'red' });
    const player2 = new Player({ color: 'blue' });
    const chip1 = new Chip({ player: player1 });
    const chip2 = new Chip({ player: player2 });
    grid.placeChip({ column: 2, chip: chip1 });
    expect(grid.columns[2][0]).toEqual(chip1);
    expect(grid.columns[2][0]).toHaveProperty('column', 2);
    expect(grid.columns[2][0]).toHaveProperty('row', 0);
    expect(grid).toHaveProperty('lastPlacedChip', chip1);
    grid.placeChip({ column: 2, chip: chip2 });
    expect(grid.columns[2][1]).toEqual(chip2);
    expect(grid.columns[2][1]).toHaveProperty('column', 2);
    expect(grid.columns[2][1]).toHaveProperty('row', 1);
    expect(grid).toHaveProperty('lastPlacedChip', chip2);
  });

});

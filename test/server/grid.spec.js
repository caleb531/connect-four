import { test, expect } from '@playwright/test';
import Grid from '../../server/grid.js';

test.describe('server grid', async () => {

  test('should initialize with no arguments', async () => {
    const grid = new Grid();
    expect(grid).toHaveProperty('columnCount', 7);
    expect(grid).toHaveProperty('rowCount', 6);
  });

  test('should initialize with arguments', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid).toHaveProperty('columnCount', 9);
    expect(grid).toHaveProperty('rowCount', 8);
  });

  test('should serialize as JSON', async () => {
    const grid = new Grid({
      columnCount: 5,
      rowCount: 8
    });
    const chip = { column: 3, player: 'green' };
    grid.placeChip(chip);
    const json = grid.toJSON();
    expect(json).toHaveProperty('columnCount', 5);
    expect(json).toHaveProperty('rowCount', 8);
    expect(json.columns).toEqual([
      [],
      [],
      [],
      [chip],
      []
    ]);
    expect(chip).toHaveProperty('row', 0);
    expect(json).toHaveProperty('lastPlacedChip', chip);
  });

});

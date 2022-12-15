import { test, expect } from '@playwright/test';
import Grid from '../../app/server/grid.js';

test.describe('server grid', async () => {

  test('should initialize with no arguments', async () => {
    const grid = new Grid();
    expect(grid).to.have.property('columnCount', 7);
    expect(grid).to.have.property('rowCount', 6);
  });

  test('should initialize with arguments', async () => {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid).to.have.property('columnCount', 9);
    expect(grid).to.have.property('rowCount', 8);
  });

  test('should serialize as JSON', async () => {
    const grid = new Grid({
      columnCount: 5,
      rowCount: 8
    });
    const chip = { column: 3, player: 'green' };
    grid.placeChip(chip);
    const json = grid.toJSON();
    expect(json).to.have.property('columnCount', 5);
    expect(json).to.have.property('rowCount', 8);
    expect(json.columns).to.deep.equal([
      [],
      [],
      [],
      [chip],
      []
    ]);
    expect(chip).to.have.property('row', 0);
    expect(json).to.have.property('lastPlacedChip', chip);
  });

});

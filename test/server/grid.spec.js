import Grid from '../../app/server/grid.js';

describe('server grid', function () {

  it('should initialize with no arguments', function () {
    const grid = new Grid();
    expect(grid).to.have.property('columnCount', 7);
    expect(grid).to.have.property('rowCount', 6);
  });

  it('should initialize with arguments', function () {
    const grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    expect(grid).to.have.property('columnCount', 9);
    expect(grid).to.have.property('rowCount', 8);
  });

  it('should serialize as JSON', function () {
    const grid = new Grid({
      columnCount: 5,
      rowCount: 8
    });
    const chip = {column: 3, player: 'green'};
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

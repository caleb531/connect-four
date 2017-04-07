'use strict';

var _ = require('underscore');
var expect = require('chai').expect;
var Grid = require('../app/scripts/models/grid');
var Player = require('../app/scripts/models/player');
var Chip = require('../app/scripts/models/chip');

describe('grid', function () {

  it('should initialize', function () {
    var grid = new Grid({
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
    var grid1 = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    var player = new Player({color: 'red'});
    var chip = new Chip({player: player});
    grid1.placeChip({column: 3, chip: chip});
    var grid2 = new Grid(grid1);
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
    var grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    var player = new Player({color: 'red', name: 'Bob'});
    _.times(9, function (c) {
      _.times(8, function () {
        grid.columns[c].push(new Chip({player: player}));
      });
    });
    expect(grid.checkIfFull()).to.be.true;
  });

  it('should know when it is not full', function () {
    var grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    var player = new Player({color: 'red', name: 'Bob'});
    _.times(9, function (c) {
      _.times(7, function () {
        grid.columns[c].push(new Chip({player: player}));
      });
    });
    expect(grid.checkIfFull()).to.be.false;
  });

  it('should reset', function () {
    var grid = new Grid({
      columnCount: 9,
      rowCount: 8
    });
    var player = new Player({color: 'red', name: 'Bob'});
    _.times(9, function (c) {
      _.times(6, function () {
        grid.columns[c].push(new Chip({player: player}));
      });
    });
    grid.resetGrid();
    grid.columns.forEach(function (column) {
      expect(column).to.have.length(0);
    });
    expect(grid).to.have.property('lastPlacedChip', null);
  });

  it('should place chip and set its column/row', function () {
    var grid = new Grid({
      columnCount: 9,
      rowCount: 6
    });
    var player1 = new Player({color: 'red'});
    var player2 = new Player({color: 'blue'});
    var chip1 = new Chip({player: player1});
    var chip2 = new Chip({player: player2});
    grid.placeChip({column: 2, chip: chip1});
    expect(grid).to.have.property('lastPlacedChip', chip1);
    grid.placeChip({column: 2, chip: chip2});
    expect(grid.columns[2][0]).to.be.an.instanceof(Chip);
    expect(grid.columns[2][0]).to.have.property('column', 2);
    expect(grid.columns[2][0]).to.have.property('row', 0);
    expect(grid.columns[2][1]).to.be.an.instanceof(Chip);
    expect(grid.columns[2][1]).to.have.property('column', 2);
    expect(grid.columns[2][1]).to.have.property('row', 1);
    expect(grid).to.have.property('lastPlacedChip', chip2);
  });

});

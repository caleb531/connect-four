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
  });

  // Place chips at the given columns with the given players
  function placeChips(args) {
    var currentPlayer = args.players[0];
    args.columns.forEach(function (column) {
      var chip = new Chip({player: currentPlayer});
      args.grid.placeChip({column: column, chip: chip});
      if (currentPlayer == args.players[0]) {
        currentPlayer = args.players[1];
      } else {
        currentPlayer = args.players[0];
      }
    });
  }

  it('should place chip and set its column/row', function () {
    var grid = new Grid({
      columnCount: 9,
      rowCount: 6
    });
    var player1 = new Player({color: 'red'});
    var player2 = new Player({color: 'blue'});
    placeChips({
      grid: grid,
      players: [player1, player2],
      columns: [2, 2]
    });
    expect(grid.columns[2][0]).to.be.an.instanceof(Chip);
    expect(grid.columns[2][0]).to.have.property('column', 2);
    expect(grid.columns[2][0]).to.have.property('row', 0);
    expect(grid.columns[2][1]).to.be.an.instanceof(Chip);
    expect(grid.columns[2][1]).to.have.property('column', 2);
    expect(grid.columns[2][1]).to.have.property('row', 1);
  });

  describe('score', function () {

    it('should be 0 for empty grid', function () {
      var grid = new Grid({
        columnCount: 7,
        rowCount: 6
      });
      var maxPlayer = new Player({color: 'red'});
      var minPlayer = new Player({color: 'blue'});
      expect(grid.getScore(maxPlayer, maxPlayer, minPlayer)).to.equal(0);
      expect(grid.getScore(minPlayer, maxPlayer, minPlayer)).to.equal(0);
    });

    it('should be 1000 for max player win', function () {
      var grid = new Grid({
        columnCount: 7,
        rowCount: 6
      });
      var maxPlayer = new Player({color: 'red'});
      var minPlayer = new Player({color: 'blue'});
      placeChips({
        grid: grid,
        players: [maxPlayer, minPlayer],
        columns: [2, 3, 3, 2, 4, 4, 4, 5, 5, 5, 5]
      });
      expect(grid.getScore(maxPlayer, maxPlayer, minPlayer)).to.equal(1000);
    });

    it('should be -1000 for min player win', function () {
      var grid = new Grid({
        columnCount: 7,
        rowCount: 6
      });
      var maxPlayer = new Player({color: 'red'});
      var minPlayer = new Player({color: 'blue'});
      placeChips({
        grid: grid,
        players: [minPlayer, maxPlayer],
        columns: [2, 3, 3, 2, 4, 4, 4, 5, 5, 5, 5]
      });
      expect(grid.getScore(minPlayer, maxPlayer, minPlayer)).to.equal(-1000);
    });

    it('should count connect-threes for max player', function () {
      var grid = new Grid({
        columnCount: 7,
        rowCount: 6
      });
      var maxPlayer = new Player({color: 'red'});
      var minPlayer = new Player({color: 'blue'});
      placeChips({
        grid: grid,
        players: [maxPlayer, minPlayer],
        columns: [2, 0, 3, 6, 4, 3]
      });
      expect(grid.getScore(maxPlayer, maxPlayer, minPlayer)).to.equal(8);
      expect(grid.getScore(minPlayer, maxPlayer, minPlayer)).to.equal(8);
    });

    it('should count connect-threes for min player', function () {
      var grid = new Grid({
        columnCount: 7,
        rowCount: 6
      });
      var maxPlayer = new Player({color: 'red'});
      var minPlayer = new Player({color: 'blue'});
      placeChips({
        grid: grid,
        players: [minPlayer, maxPlayer],
        columns: [2, 0, 3, 6, 4, 3]
      });
      expect(grid.getScore(maxPlayer, maxPlayer, minPlayer)).to.equal(-8);
      expect(grid.getScore(minPlayer, maxPlayer, minPlayer)).to.equal(8);
    });

    it('should be 0 if neither player has an advantage', function () {
      var grid = new Grid({
        columnCount: 7,
        rowCount: 6
      });
      var maxPlayer = new Player({color: 'red'});
      var minPlayer = new Player({color: 'blue'});
      placeChips({
        grid: grid,
        players: [maxPlayer, minPlayer],
        columns: [0, 2, 1, 3, 4, 6, 5]
      });
      expect(grid.getScore(maxPlayer, maxPlayer, minPlayer)).to.equal(0);
      expect(grid.getScore(minPlayer, maxPlayer, minPlayer)).to.equal(0);
    });

  });

});

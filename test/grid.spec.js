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

});

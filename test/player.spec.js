'use strict';

var expect = require('chai').expect;
var Player = require('../app/scripts/models/player');

describe('player', function () {

  it('should initialize', function () {
    var player = new Player({
      name: 'Super Player',
      color: 'green'
    });
    expect(player).to.have.property('name', 'Super Player');
    expect(player).to.have.property('color', 'green');
    expect(player).to.have.property('score', 0);
  });

});

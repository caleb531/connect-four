'use strict';

var expect = require('chai').expect;
var Player = require('../app/scripts/player');
var Chip = require('../app/scripts/chip');

describe('chip', function () {

  it('should initialize chip', function () {
    var player = new Player({
      color: 'green',
      name: 'Super Player'
    });
    var chip = new Chip({
      player: player
    });
    expect(chip).to.have.property('player', player);
    expect(chip).to.have.property('column', null);
    expect(chip).to.have.property('row', null);
    expect(chip).to.have.property('highlighted', false);
  });

});

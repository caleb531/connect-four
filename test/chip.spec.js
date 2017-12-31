var expect = require('chai').expect;
var Player = require('../app/scripts/models/player');
var Chip = require('../app/scripts/models/chip');

describe('chip', function () {

  it('should initialize', function () {
    var player = new Player({
      color: 'blue',
      name: 'Super Player'
    });
    var chip = new Chip({
      player: player
    });
    expect(chip).to.have.property('player', player);
    expect(chip).to.have.property('column', null);
    expect(chip).to.have.property('row', null);
    expect(chip).to.have.property('winning', false);
  });

});

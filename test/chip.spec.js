import { expect } from 'chai';
import Player from '../app/scripts/models/player';
import Chip from '../app/scripts/models/chip';

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

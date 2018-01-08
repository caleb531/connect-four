import { expect } from 'chai';
import Player from '../app/scripts/models/player.js';
import Chip from '../app/scripts/models/chip.js';

describe('chip', function () {

  it('should initialize', function () {
    let player = new Player({
      color: 'blue',
      name: 'Super Player'
    });
    let chip = new Chip({
      player: player
    });
    expect(chip).to.have.property('player', player);
    expect(chip).to.have.property('column', null);
    expect(chip).to.have.property('row', null);
    expect(chip).to.have.property('winning', false);
  });

});

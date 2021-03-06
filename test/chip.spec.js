import Player from '../app/scripts/models/player.js';
import Chip from '../app/scripts/models/chip.js';

describe('chip', function () {

  it('should initialize', function () {
    const player = new Player({
      color: 'blue',
      name: 'Super Player'
    });
    const chip = new Chip({
      player
    });
    expect(chip).to.have.property('player', player);
    expect(chip).to.have.property('column', null);
    expect(chip).to.have.property('row', null);
    expect(chip).to.have.property('winning', false);
  });

});

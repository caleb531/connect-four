import Player from '../scripts/models/player.js';
import Chip from '../scripts/models/chip.js';

describe('chip', async () => {

  it('should initialize', async () => {
    const player = new Player({
      color: 'blue',
      name: 'Super Player'
    });
    const chip = new Chip({
      player
    });
    expect(chip).toHaveProperty('player', player);
    expect(chip).toHaveProperty('column', null);
    expect(chip).toHaveProperty('row', null);
    expect(chip).toHaveProperty('winning', false);
  });

});

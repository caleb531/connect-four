import { test, expect } from '@playwright/test';
import Player from '../scripts/models/player.js';
import Chip from '../scripts/models/chip.js';

test.describe('chip', async () => {

  test('should initialize', async () => {
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

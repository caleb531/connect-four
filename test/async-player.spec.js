import { test, expect } from '@playwright/test';
import AsyncPlayer from '../scripts/models/async-player.js';

test.describe('async player', async () => {

  class MyAsyncPlayer extends AsyncPlayer {
    // do nothing
  }

  test('should error if getNextMove is not defined', async () => {
    const asyncPlayer = new MyAsyncPlayer({
      name: 'Super Player',
      color: 'blue'
    });
    expect(asyncPlayer.getNextMove).toThrow(Error);
  });

});

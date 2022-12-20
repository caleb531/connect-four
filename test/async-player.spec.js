import AsyncPlayer from '../scripts/models/async-player.js';

describe('async player', async () => {

  class MyAsyncPlayer extends AsyncPlayer {
    // do nothing
  }

  it('should error if getNextMove is not defined', async () => {
    const asyncPlayer = new MyAsyncPlayer({
      name: 'Super Player',
      color: 'blue'
    });
    expect(asyncPlayer.getNextMove).toThrow(Error);
  });

});

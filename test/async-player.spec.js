import AsyncPlayer from '../app/scripts/models/async-player.js';

describe('async player', function () {

  class MyAsyncPlayer extends AsyncPlayer {
    // do nothing
  }

  it('should error if getNextMove is not defined', function () {
    const asyncPlayer = new MyAsyncPlayer({
      name: 'Super Player',
      color: 'blue'
    });
    expect(asyncPlayer.getNextMove).to.throw(Error);
  });

});

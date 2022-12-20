import HumanPlayer from '../scripts/models/human-player.js';

describe('human player', async () => {

  it('should initialize', async () => {
    const humanPlayer = new HumanPlayer({
      name: 'Super Player',
      color: 'blue'
    });
    expect(humanPlayer).toHaveProperty('name', 'Super Player');
    expect(humanPlayer).toHaveProperty('color', 'blue');
    expect(humanPlayer).toHaveProperty('score', 0);
    expect(humanPlayer).toHaveProperty('type', 'human');
  });

});

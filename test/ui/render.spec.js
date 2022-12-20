import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { $, $$ } from './utils.js';

describe('game UI', async () => {

  beforeAll(_before);
  beforeEach(_beforeEach);
  afterEach(_afterEach);

  it('should render initial buttons', async () => {
    const buttons = $$('#game-dashboard button');
    expect(buttons[0]).toHaveTextContent('1 Player');
    expect(buttons[1]).toHaveTextContent('2 Players');
  });

  it('should render initial grid', async () => {
    const slots = $$('.empty-chip-slot');
    expect(slots).toHaveLength(42);
  });

});

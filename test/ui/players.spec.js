import m from 'mithril';
import userEvent from '@testing-library/user-event';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { $, $$ } from './utils.js';

describe('game UI', async () => {

  beforeAll(_before);
  beforeEach(_beforeEach);
  afterEach(_afterEach);

  it('should ask for starting player in 1-Player mode', async () => {
    await userEvent.click($('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    const buttons = $$('#game-dashboard button');
    expect(buttons[0]).toHaveTextContent('Human');
    expect(buttons[1]).toHaveTextContent('Mr. A.I.');
  });

  it('should start with Human when chosen in 1-Player mode', async () => {
    await userEvent.click($('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    await userEvent.click($('#game-dashboard button')[0]); // "Human"
    m.redraw.sync();
    const pendingChip = $('.chip.pending');
    expect(pendingChip).toHaveClass('red');
  });

  it('should start with AI when chosen in 1-Player mode', async () => {
    await userEvent.click($('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    await userEvent.click($('#game-dashboard button')[1]); // "Mr. A.I."
    m.redraw.sync();
    const pendingChip = $('.chip.pending');
    expect(pendingChip).toHaveClass('black');
  });

});

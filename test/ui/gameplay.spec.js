import m from 'mithril';
import userEvent from '@testing-library/user-event';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { clickGrid, waitForPendingChipTransitionEnd } from './utils.js';
import { $, $$ } from './utils.js';

describe('game UI', async () => {

  beforeAll(_before);
  beforeEach(_beforeEach);
  afterEach(_afterEach);

  it('should place chip in initial column', async () => {
    await userEvent.click($$('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    await userEvent.click($$('#game-dashboard button')[0]); // "Human"
    m.redraw.sync();
    const grid = $('#grid');
    await clickGrid({ grid, column: 0 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHaveChipAt({
      column: 0,
      row: 5,
      chipColor: 'red'
    });
  });

  it('should align chip to clicked column', async () => {
    await userEvent.click($$('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    await userEvent.click($$('#game-dashboard button')[0]); // "Human"
    m.redraw.sync();
    const grid = $('#grid');
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHavePendingChipAt({ column: 3 });
  });

  it('should place chip after aligning', async () => {
    await userEvent.click($$('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    m.redraw.sync();
    await userEvent.click($$('#game-dashboard button')[0]); // "Human"
    m.redraw.sync();
    m.redraw.sync();
    const grid = $('#grid');
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHaveChipAt({
      column: 3,
      row: 5,
      chipColor: 'red'
    });
  });

  it('should signal AI to place chip on its turn', async () => {
    await userEvent.click($$('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    await userEvent.click($$('#game-dashboard button')[0]); // "Human"
    m.redraw.sync();
    const grid = $('#grid');
    // Human's turn
    // Human chip's initial position (before placing)
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHavePendingChipAt({ column: 3 });
    // Place human chip
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHaveChipAt({
      column: 3,
      row: 5,
      chipColor: 'red'
    });
    // Place AI chip
    await waitForPendingChipTransitionEnd({ grid });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHavePendingChipAt({ column: 2 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHaveChipAt({
      column: 2,
      row: 5,
      chipColor: 'black'
    });
  });

  it('should align chip to hovered column', async () => {
    await userEvent.click($$('#game-dashboard button')[0]); // "1-Player"
    m.redraw.sync();
    await userEvent.click($$('#game-dashboard button')[0]); // "Human"
    m.redraw.sync();
    const grid = $('#grid');
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    expect(grid).toHavePendingChipAt({ column: 3 });
  });

});

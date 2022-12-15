import { test, expect } from '@playwright/test';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { qsa } from './utils.js';

test.describe('game UI', async () => {

  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should render initial buttons', async () => {
    const buttons = qsa('#game-dashboard button');
    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('1 Player');
    expect(buttons[1]).to.have.text('2 Players');
  });

  test('should render initial grid', async () => {
    const slots = qsa('.empty-chip-slot');
    expect(slots).to.have.length(42);
  });

});

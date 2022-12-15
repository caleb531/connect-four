import { test, expect } from '@playwright/test';
import m from 'mithril';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { qs, qsa } from './utils.js';

test.describe('game UI', async () => {

  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should ask for starting player in 1-Player mode', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human');
    expect(buttons[1]).to.have.text('Mr. A.I.');
  });

  // test('should ask for starting player in 2-Player mode', async () => {
  //   qsa('#game-dashboard button')[1].click();
  //   m.redraw.sync();
  //   const buttons = qsa('#game-dashboard button');
  //   expect(buttons[0]).to.have.text('Human 1');
  //   expect(buttons[1]).to.have.text('Human 2');
  // });

  test('should start with Human when chosen in 1-Player mode', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  test('should start with AI when chosen in 1-Player mode', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    const pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('black');
  });

  // test('should start with Human 1 when chosen in 2-Player mode', async () => {
  //   qsa('#game-dashboard button')[1].click();
  //   m.redraw.sync();
  //   qsa('#game-dashboard button')[0].click();
  //   m.redraw.sync();
  //   const pendingChip = qs('.chip.pending');
  //   expect(pendingChip).to.have.class('red');
  // });

  // test('should start with Human 2 when chosen in 2-Player mode', async () => {
  //   qsa('#game-dashboard button')[1].click();
  //   m.redraw.sync();
  //   qsa('#game-dashboard button')[1].click();
  //   m.redraw.sync();
  //   const pendingChip = qs('.chip.pending');
  //   expect(pendingChip).to.have.class('blue');
  // });

});

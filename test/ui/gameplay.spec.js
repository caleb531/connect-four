import { test, expect } from '@playwright/test';
import m from 'mithril';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { qs, qsa } from './utils.js';
import { onPendingChipTransitionEnd, triggerMouseEvent } from './utils.js';

test.describe('game UI', async () => {

  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  // Add syntactic sugar assertion for testing CSS translate values
  expect.extend({
    toHaveTranslate: (received, expectedX, expectedY) => {
      const translate = received.style.transform;
      const actualX = parseFloat(translate.slice(translate.indexOf('(') + 1));
      const actualY = parseFloat(translate.slice(translate.indexOf(',') + 1));
      if (actualX === expectedX && actualY === expectedY) {
        return {
          message: () => `expected ${received} to have translate (${expectedX}, ${expectedY}) but got (${actualX}, ${actualY})`,
          pass: true
        };
      } else {
        return {
          message: () => `expected ${received} to have translate (${expectedX}, ${expectedY}) but got (${actualX}, ${actualY})`,
          pass: false
        };
      }
    }
  });

  test('should place chip in initial column', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const grid = qs('#grid');
    await onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).toHaveTranslate(0, 600);
        done();
      });
    triggerMouseEvent(grid, 'click', 0, 0);
  });

  test('should align chip to clicked column', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const grid = qs('#grid');
    await onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).toHaveTranslate(300, 0);
        done();
      });
    triggerMouseEvent(grid, 'click', 192, 0);

  });

  test('should place chip after aligning', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const grid = qs('#grid');
    await onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).toHaveTranslate(300, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).toHaveTranslate(300, 600);
        done();
      });
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  test('should signal AI to place chip on its turn', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const grid = qs('#grid');
    // Human's turn
    await onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        // Human chip's initial position
        expect(pendingChip).toHaveTranslate(300, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        // Human chip's final position
        expect(pendingChip).toHaveTranslate(300, 600);
        return onPendingChipTransitionEnd();
      })
      // AI's turn
      .then(function (pendingChip) {
        // AI chip's initial position
        expect(pendingChip).to.have.class('black');
        expect(pendingChip).toHaveTranslate(200, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        // AI chip's final position
        expect(pendingChip).toHaveTranslate(200, 600);
        done();
      });
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  test('should align chip to hovered column', async () => {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    const grid = qs('#grid');
    await onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).toHaveTranslate(300, 0);
        done();
      });
    triggerMouseEvent(grid, 'mousemove', 192, 0);
  });

});

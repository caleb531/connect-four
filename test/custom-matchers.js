import { expect } from '@playwright/test';
import sinonMatchers from 'sinon-matchers';
import { ROW_COUNT } from './constants.js';
import _ from 'underscore';

expect.extend({
  // Both Playwright and sinon-matchers include toThrow/toThrowError matchers,
  // so we pick Playwright's matchers because they are more useful
  ..._.omit(sinonMatchers, ['toThrow', 'toThrowError']),
  // Expect the given value to be one of the provided values
  toBeOneOf: (received, choices) => {
    if (choices.includes(received)) {
      return {
        message: () => `expected ${received} not to be in [${choices.join(', ')}]`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be in [${choices.join(', ')}]`,
        pass: false
      };
    }
  },
  // Expect that the given pending chip is over the specified column on the grid
  toHavePendingChipAt: async (grid, { column }) => {
    const pendingChip = grid.locator('.chip.pending');
    const { selector, actualColumn } = await pendingChip.evaluate((pendingChipElem) => {
      const translate = pendingChipElem.style.transform;
      return {
        selector: pendingChipElem.nodeName.toLowerCase() + '.' + String(pendingChipElem.className)
          .trim()
          .replace(/\s+/g, '.'),
        actualColumn: Math.round((parseFloat(translate.slice(translate.indexOf('(') + 1)) / 100))
      };
    });
    if (actualColumn === column) {
      return {
        message: () => `expected ${selector} not to be at column ${column} but got ${actualColumn}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${selector} to be at column ${column} but got ${actualColumn}`,
        pass: false
      };
    }
  },
  // Expect that the given grid locator has a chip of the given color at the
  // specified row/column
  toHaveChipAt: async (grid, { column, row, chipColor }) => {
    // TODO
    const nthColumn = grid.locator('.grid-column').nth(column);
    const chip = nthColumn.locator(`.chip.${chipColor}:nth-child(${ROW_COUNT - row})`);
    if ((await chip.count()) === 1) {
      return {
        message: () => `expected ${chipColor} chip not to be placed at column ${column}, row ${row}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${chipColor} chip to be placed at column ${column}, row ${row}`,
        pass: false
      };
    }
  }
});

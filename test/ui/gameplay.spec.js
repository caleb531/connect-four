import { test, expect } from '@playwright/test';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { clickGrid, waitForPendingChipTransitionEnd } from './utils.js';

test.describe('game UI', async () => {

  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should place chip in initial column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await clickGrid({ grid, column: 0 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHaveChipAt({
      column: 0,
      row: 5,
      chipColor: 'red'
    });
  });

  test('should align chip to clicked column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHavePendingChipAt({ column: 3 });
  });

  test('should place chip after aligning', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHaveChipAt({
      column: 3,
      row: 5,
      chipColor: 'red'
    });
  });

  test('should signal AI to place chip on its turn', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    // Human's turn
    // Human chip's initial position (before placing)
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHavePendingChipAt({ column: 3 });
    // Place human chip
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHaveChipAt({
      column: 3,
      row: 5,
      chipColor: 'red'
    });
    // Place AI chip
    await waitForPendingChipTransitionEnd({ grid });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHavePendingChipAt({ column: 2 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHaveChipAt({
      column: 2,
      row: 5,
      chipColor: 'black'
    });
  });

  test('should align chip to hovered column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await clickGrid({ grid, column: 3 });
    await waitForPendingChipTransitionEnd({ grid });
    await expect(grid).toHavePendingChipAt({ column: 3 });
  });

});

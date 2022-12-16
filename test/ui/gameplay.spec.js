import { test, expect } from '@playwright/test';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { onPendingChipTransitionEnd, triggerMouseEvent } from './utils.js';

test.describe('game UI', async () => {

  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should place chip in initial column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await triggerMouseEvent(grid, 'click', 0, 0);
    const pendingChip = await onPendingChipTransitionEnd({ page });
    await expect(pendingChip).toHaveTranslate(0, 600);
  });

  test('should align chip to clicked column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await triggerMouseEvent(grid, 'click', 192, 0);
    const pendingChip = await onPendingChipTransitionEnd({ page });
    await expect(pendingChip, page).toHaveTranslate(300, 0);
  });

  test('should place chip after aligning', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await triggerMouseEvent(grid, 'click', 192, 0);
    let pendingChip;
    pendingChip = await onPendingChipTransitionEnd({ page });
    await expect(pendingChip).toHaveTranslate(300, 0);
    await triggerMouseEvent(grid, 'click', 192, 0);
    pendingChip = await onPendingChipTransitionEnd({ page });
    await expect(pendingChip).toHaveTranslate(300, 600);
  });

  test('should signal AI to place chip on its turn', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    let pendingChip;
    // Human's turn
    await triggerMouseEvent(grid, 'click', 192, 0);
    pendingChip = await onPendingChipTransitionEnd({ page });
    // Human chip's initial position
    await expect(pendingChip).toHaveTranslate(300, 0);
    await triggerMouseEvent(grid, 'click', 192, 0);
    pendingChip = await onPendingChipTransitionEnd({ page });
    // Human chip's final position
    await expect(pendingChip).toHaveTranslate(300, 600);
    pendingChip = await onPendingChipTransitionEnd({ page });
    // AI's turn
    // AI chip's initial position
    await expect(pendingChip).toHaveClass('black');
    await expect(pendingChip).toHaveTranslate(200, 0);
    pendingChip = await onPendingChipTransitionEnd({ page });
    // AI chip's final position
    await expect(pendingChip).toHaveTranslate(200, 600);
  });

  test('should align chip to hovered column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = page.locator('#grid');
    await triggerMouseEvent(grid, 'mousemove', 192, 0);
    const pendingChip = await onPendingChipTransitionEnd({ page });
    await expect(pendingChip).toHaveTranslate(300, 0);
  });

});

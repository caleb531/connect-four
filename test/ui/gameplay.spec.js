import { test, expect } from '@playwright/test';
import { _before, _beforeEach, _afterEach } from './fixtures.js';

test.describe('game UI', async () => {

  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should place chip in initial column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = await page.locator('#grid');
    await grid.click({ position: { x: 0, y: 0 } });
    const pendingChip = await page.locator('.chip.pending');
    await grid.click({ position: { x: 0, y: 0 } });
    await expect(pendingChip).toHaveTranslate(0, 600);
  });

  test('should align chip to clicked column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = await page.locator('#grid');
    await grid.click({ position: { x: 192, y: 0 } });
    const pendingChip = await page.locator('.chip.pending');
    await expect(pendingChip, page).toHaveTranslate(300, 0);
  });

  test('should place chip after aligning', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = await page.locator('#grid');
    await grid.click({ position: { x: 192, y: 0 } });
    let pendingChip;
    pendingChip = await page.locator('.chip.pending');
    await expect(pendingChip).toHaveTranslate(300, 0);
    await grid.click({ position: { x: 192, y: 0 } });
    pendingChip = await page.locator('.chip.pending');
    await grid.click({ position: { x: 192, y: 0 } });
    await expect(pendingChip).toHaveTranslate(300, 600);
  });

  test('should signal AI to place chip on its turn', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = await page.locator('#grid');
    let pendingChip;
    // Human's turn
    // Human chip's initial position (before placing)
    await grid.click({ position: { x: 192, y: 0 } });
    pendingChip = await page.locator('.chip.pending');
    await expect(pendingChip).toHaveTranslate(300, 0);
    // Place human chip
    await grid.click({ position: { x: 192, y: 0 } });
    await expect(pendingChip).toHaveTranslate(300, 600);
    pendingChip = await page.locator('.chip.pending');
    // AI's turn
    // AI chip's initial position (before placing)
    await expect(pendingChip).toHaveClass(/black/);
    await expect(pendingChip).toHaveTranslate(200, 0);
    pendingChip = await page.locator('.chip.pending');
    await grid.click({ position: { x: 200, y: 0 } });
    // AI chip's final position (after placing)
    await expect(pendingChip).toHaveTranslate(200, 600);
  });

  test('should align chip to hovered column', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const grid = await page.locator('#grid');
    await grid.click({ position: { x: 192, y: 0 } });
    const pendingChip = await page.locator('.chip.pending');
    await expect(pendingChip).toHaveTranslate(300, 0);
  });

});

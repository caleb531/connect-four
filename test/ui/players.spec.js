import { test, expect } from '@playwright/test';
import { _before, _beforeEach, _afterEach } from './fixtures.js';

test.describe('game UI', async () => {
  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should ask for starting player in 1-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    const buttons = page.locator('#game-dashboard button');
    await expect(buttons.nth(0)).toHaveText('Human');
    await expect(buttons.nth(1)).toHaveText('Mr. A.I.');
  });

  test('should start with Human when chosen in 1-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Human' }).click();
    const pendingChip = page.locator('.chip.pending');
    await expect(pendingChip).toHaveClass(/red/);
  });

  test('should start with AI when chosen in 1-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '1 Player' }).click();
    await page.getByRole('button', { name: 'Mr. A.I.' }).click();
    const pendingChip = page.locator('.chip.pending');
    await expect(pendingChip).toHaveClass(/black/);
  });
});

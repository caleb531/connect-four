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

  test('should ask for starting player in same-device 2-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Same device' }).click();
    const buttons = page.locator('#game-dashboard button');
    await expect(buttons.nth(0)).toHaveText('Human 1');
    await expect(buttons.nth(1)).toHaveText('Human 2');
  });

  test('should ask for a player name in different-device 2-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Different device' }).click();
    await expect(page.locator('#game-message')).toHaveText('Enter your player name:');
    await expect(page.locator('#new-player-name')).toBeVisible();
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

  test('should start with Human 1 when chosen in same-device 2-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Same device' }).click();
    await page.getByRole('button', { name: 'Human 1' }).click();
    const pendingChip = page.locator('.chip.pending');
    await expect(pendingChip).toHaveClass(/red/);
  });

  test('should start with Human 2 when chosen in same-device 2-Player mode', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Same device' }).click();
    await page.getByRole('button', { name: 'Human 2' }).click();
    const pendingChip = page.locator('.chip.pending');
    await expect(pendingChip).toHaveClass(/blue/);
  });
});

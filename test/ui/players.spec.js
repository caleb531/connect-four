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

  test('should start same-device 2-Player mode with Human 2', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Same device' }).click();
    const pendingChip = page.locator('.chip.pending');
    await expect(pendingChip).toHaveClass(/blue/);
  });

  test('should alternate same-device 2-Player starting players', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Same device' }).click();
    await page.getByRole('button', { name: 'End Game' }).click();
    await page.getByRole('button', { name: '2 Players' }).click();
    await page.getByRole('button', { name: 'Same device' }).click();
    const pendingChip = page.locator('.chip.pending');
    await expect(pendingChip).toHaveClass(/red/);
  });
});

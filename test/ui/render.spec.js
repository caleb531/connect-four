import { test, expect } from '@playwright/test';
import { _before, _beforeEach, _afterEach } from './fixtures.js';

test.describe('game UI', async () => {
  test.beforeAll(_before);
  test.beforeEach(_beforeEach);
  test.afterEach(_afterEach);

  test('should render initial buttons', async ({ page }) => {
    const buttons = page.locator('#game-dashboard button');
    await expect(buttons.nth(0)).toHaveText('1 Player');
    await expect(buttons.nth(1)).toHaveText('2 Players');
  });

  test('should render two-player device choices', async ({ page }) => {
    await page.getByRole('button', { name: '2 Players' }).click();
    const buttons = page.locator('#game-dashboard button');
    await expect(page.locator('#game-message')).toHaveText('Where will both players play?');
    await expect(buttons.nth(0)).toHaveText('Same device');
    await expect(buttons.nth(1)).toHaveText('Different device');
  });

  test('should render initial grid', async ({ page }) => {
    const slots = page.locator('.empty-chip-slot');
    await expect(slots).toHaveCount(42);
  });
});

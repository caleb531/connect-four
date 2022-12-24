import AIPlayer from '../../scripts/models/ai-player.js';

export async function _before() {
  // Also zero out the AI Player's delay between each swift movement
  AIPlayer.prototype.waitDelay = 0;
}

export async function _beforeEach({ page }) {
  await page.goto('./');
  await page.evaluate(() => {
    // Minimize the transition duration to speed up tests (interestingly, a
    // duration of 0ms will prevent transitionEnd from firing)
    const style = document.createElement('style');
    style.className = 'transition-duration-speedup';
    style.innerHTML = '* {transition-duration: 50ms !important;}';
    document.head.appendChild(style);
  });
}

export async function _afterEach() {
  // noop for now
}

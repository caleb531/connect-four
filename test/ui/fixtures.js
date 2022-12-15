import m from 'mithril';
import AppComponent from '../../app/scripts/components/app.js';
import AIPlayer from '../../app/scripts/models/ai-player.js';
import { qs } from './utils.js';

export async function _before() {
  // Also zero out the AI Player's delay between each swift movement
  AIPlayer.prototype.waitDelay = 0;
}

export async function _beforeEach({ page }) {
  await page.goto('./');
  await page.evaluate(async () => {
    // Minimize the transition duration to speed up tests (interestingly, a
    // duration of 0ms will prevent transitionEnd from firing)
    const style = document.createElement('style');
    style.className = 'test-duration-speedup';
    style.innerHTML = '* {transition-duration: 50ms !important;}';
    document.head.appendChild(style);
    // Mount and render application for each test
    document.body.appendChild(document.createElement('main'));
    m.mount(qs('main'), AppComponent);
  });
}

export async function _afterEach({ page }) {
  const mainElement = await page.locator('main').elementHandle();
  m.mount(mainElement, null);
}

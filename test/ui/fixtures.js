import m from 'mithril';
import AppComponent from '../../app/scripts/components/app.js';
import AIPlayer from '../../app/scripts/models/ai-player.js';
import { qs } from './utils.js';

export function _before() {
  // Minimize the transition duration to speed up tests (interestingly, a
  // duration of 0ms will prevent transitionEnd from firing)
  const style = document.createElement('style');
  style.innerHTML = '* {transition-duration: 100ms !important;}';
  document.head.appendChild(style);
  // Also zero out the AI Player's delay between each swift movement
  AIPlayer.waitDelay = 0;
}

export function _beforeEach() {
  document.body.appendChild(document.createElement('main'));
  m.mount(qs('main'), AppComponent);
}

export function _afterEach() {
  m.mount(qs('main'), null);
}

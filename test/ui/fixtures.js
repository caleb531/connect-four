import m from 'mithril';
import AppComponent from '../../scripts/components/app.js';
import AIPlayer from '../../scripts/models/ai-player.js';
import { $ } from './utils.js';
import "@testing-library/jest-dom";

export async function _before() {
  // Also zero out the AI Player's delay between each swift movement
  AIPlayer.prototype.waitDelay = 0;
}

export async function _beforeEach() {
  document.body.appendChild(document.createElement('main'));
  m.mount($('main'), AppComponent);
  localStorage.clear();
  sessionStorage.clear();
}

export async function _afterEach() {
  m.mount($('main'), null);
}

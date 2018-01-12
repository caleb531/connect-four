import m from 'mithril';
import GameComponent from '../../app/scripts/components/game.js';
import { qs } from './utils.js';

// Minimize the transition duration to speed up tests (interestingly, a
// duration of 0ms will prevent transitionEnd from firing)
function _before() {
  let style = document.createElement('style');
  style.innerHTML = '* {transition-duration: 200ms !important;}';
  document.head.appendChild(style);
}

function _beforeEach() {
  document.body.appendChild(document.createElement('main'));
  m.mount(qs('main'), GameComponent);
}

function _afterEach() {
  m.mount(qs('main'), null);
}

export { _before, _beforeEach, _afterEach };

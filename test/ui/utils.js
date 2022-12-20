import userEvent from '@testing-library/user-event';
import { CHIP_WIDTH } from '../constants.js';

// Wait for the next transition on the given element to complete, timing out
// and erroring if the transition never completes
export async function waitForPendingChipTransitionEnd({ grid }) {
  const pendingChip = grid.querySelector('.chip.pending');
  // The nmuber of milliseconds to wait before the transitionend event listener
  // gives up; it must be defined inside this callback because of the
  // encasulated nature of .evaluate()
  const TRANSITION_WAIT_TIMEOUT = 5000;
  await new Promise((resolve, reject) => {
    pendingChip.addEventListener('transitionend', function transitionend(event) {
      // Prevent transitionend from firing on child pendingChips
      if (event.target === pendingChip) {
        pendingChip.removeEventListener('transitionend', transitionend);
        resolve(pendingChip);
      }
    });
    setTimeout(() => {
      reject(new Error('waitForPendingChipTransitionEnd gave up waiting'));
    }, TRANSITION_WAIT_TIMEOUT);
  });
  return pendingChip;
}

// Simulate a click event over the specified column on the grid
export async function clickGrid({ grid, column }) {
  await userEvent.click(grid, {
    position: {
      pageX: (column * CHIP_WIDTH) + grid.offsetLeft,
      pageY: 0 + grid.offsetTop
    }
  });
}

// Consise aliases for retrieving DOM elements

export function $(selector) {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  } else {
    throw Error(`Element matching "${selector}" does not exist`);
  }
}
export function $$(selector) {
  return document.querySelectorAll(selector);
}

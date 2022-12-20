import userEvent, { fireEvent } from '@testing-library/user-event';
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
    fireEvent(pendingChip, new Event('transitionend'));
    resolve(pendingChip);
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

export function $(selector, triesLeft = 10) {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  } else {
    throw Error(`Could not find element matching "${selector}"`);
  }
}
export async function $$(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements) {
    return elements;
  } else {
    throw Error(`Could not find any elements matching "${selector}"`);
  }
}

import { CHIP_WIDTH } from '../constants.js';

// Wait for the next transition on the given element to complete, timing out
// and erroring if the transition never completes
export async function onPendingChipTransitionEnd({ grid }) {
  const pendingChip = await grid.locator('.chip.pending');
  await pendingChip.evaluate(async (element) => {
    // The nmuber of milliseconds to wait before the transitionend event
    // listener gives up; it must be defined inside this callback because of the
    // encasulated nature of .evaluate()
    const TRANSITION_WAIT_TIMEOUT = 5000;
    await new Promise((resolve, reject) => {
      element.addEventListener('transitionend', function transitionend(event) {
        // Prevent transitionend from firing on child elements
        if (event.target === element) {
          element.removeEventListener('transitionend', transitionend);
          resolve(element);
        }
      });
      setTimeout(() => {
        reject(new Error('onPendingChipTransitionEnd gave up waiting'));
      }, TRANSITION_WAIT_TIMEOUT);
    });
  });
  return pendingChip;
}

// Simulate a click event over the specified column on the grid
export async function clickGrid({ grid, column }) {
  await grid.click({
    position: {
      x: column * CHIP_WIDTH,
      y: 0
    }
  });
  await onPendingChipTransitionEnd({ grid });
}

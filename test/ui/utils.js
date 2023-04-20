import { COLUMN_COUNT } from '../constants.js';

// Wait for the next transition on the given element to complete, timing out
// and erroring if the transition never completes
export async function waitForPendingChipTransitionEnd({ grid }) {
  const pendingChip = grid.locator('.chip.pending');
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
        // If the timeout expires (meaning we never saw the transitionend fire),
        // don't treat it as a failure, but let subsequent test assertions (from
        // the calling test) run to determine if the timeout is actually the
        // result of a problem; taking this approach handles the cases where the
        // transitionend event either 1) does not fire at all even though the
        // transition actually completed, or 2) fired before the above listener
        // was bound
        resolve(element);
      }, TRANSITION_WAIT_TIMEOUT);
    });
  });
  return pendingChip;
}

// Simulate a click event over the specified column on the grid
export async function clickGrid({ grid, column }) {
  const gridBoundingBox = await grid.boundingBox();
  const chipWidth = gridBoundingBox.width / COLUMN_COUNT;
  await grid.click({
    position: {
      x: column * chipWidth,
      y: 0
    }
  });
}

// Simulate a mousemove event over the specified column on the grid
export async function hoverGrid({ page, grid, column }) {
  const gridBoundingBox = await grid.boundingBox();
  const chipWidth = gridBoundingBox.width / COLUMN_COUNT;
  await page.mouse.move(
    gridBoundingBox.x + (column * chipWidth),
    gridBoundingBox.y
  );
}

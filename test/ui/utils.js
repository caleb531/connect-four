// Wait for the next transition on the given element to complete, timing out
// and erroring if the transition never completes
export async function onPendingChipTransitionEnd({ page }) {
  const pendingChip = page.locator('.chip.pending');
  await pendingChip.evaluate(async (element) => {
    // The nmuber of milliseconds to wait before the transitionend event
    // listener gives up; it must be defined inside this callback because of the
    // encasulated nature of .evaluate()
    const TRANSITION_WAIT_TIMEOUT = 5000;
    await new Promise(function (resolve, reject) {
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

// Simulate a mouse event at the specified coordinates, relative to the given
// element
export async function triggerMouseEvent(locator, eventType, x, y) {
  const [offsetLeft, offsetTop] = await locator.evaluate((elem) => {
    return [elem.offsetLeft, elem.offsetTop];
  });
  await locator.dispatchEvent(eventType, {
    clientX: offsetLeft + x,
    clientY: offsetTop + y
  });
}

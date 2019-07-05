export function qs(selector) {
  return document.querySelector(selector);
}

export function qsa(selector) {
  return document.querySelectorAll(selector);
}

// Wait for the next transition on the given element to complete, timing out
// and erroring if the transition never completes
export function onPendingChipTransitionEnd() {
  return new Promise(function (resolve) {
    const pendingChip = qs('.chip.pending');
    pendingChip.addEventListener('transitionend', function transitionend(event) {
      // Prevent transitionend from firing on child elements
      if (event.target === pendingChip) {
        pendingChip.removeEventListener('transitionend', transitionend);
        resolve(pendingChip);
      }
    });
  });
}

// Simulate a mouse event at the specified coordinates, relative to the given
// element
export function triggerMouseEvent(elem, eventType, x, y) {
  elem.dispatchEvent(new MouseEvent(eventType, {
    clientX: elem.offsetLeft + x,
    clientY: elem.offsetTop + y
  }));
}

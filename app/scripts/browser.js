// Utilities for cross-browser compatibility.
class Browser {

  static getNormalizedTransformProperty() {
    return 'transform';
  }

  static getNormalizedTransitionEndEventName() {
    return 'transitionend';
  }

  // Convert a DOM event name to an equivalent event name for this browser.
  static getNormalizedEventName(eventName) {
    return eventName;
  }

  // Convert CSS properties and values to equivalent properties and values for
  // this browser.
  static getNormalizedStyles(styles) {
    const normalized = {};
    Object.keys(styles).forEach((property) => {
      if (Browser.normalizedProperties[property] !== undefined) {
        normalized[Browser.normalizedProperties[property]] = styles[property];
      } else {
        normalized[property] = styles[property];
      }
    });
    return normalized;
  }

}

// Map of CSS properties to property names used by the DOM in this browser.
Browser.normalizedProperties = {
  transform: Browser.getNormalizedTransformProperty()
};
// Map of DOM event names to event names used by this browser.
Browser.normalizedEventNames = {
  transitionend: Browser.getNormalizedTransitionEndEventName()
};

export default Browser;

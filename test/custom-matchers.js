const { expect } = require('@playwright/test');

// Add syntactic sugar assertion for testing CSS translate values
expect.extend({
  toHaveBeenCalled: (received) => {
    if (received.called) {
      return {
        message: () => `expected ${received} not to have been called`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to have been called`,
        pass: false
      };
    }
  },
  toHaveBeenCalledOnce: (received) => {
    if (received.calledOnce) {
      return {
        message: () => `expected ${received} not to have been called once; called ${received.callCount} times`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to have been called once`,
        pass: false
      };
    }
  },
  toHaveBeenCalledWith: (received, ...args) => {
    if (received.calledWith(...args)) {
      return {
        message: () => `expected ${received} not to have been called with [${args.join(', ')}]`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to have been called with [${args.join(', ')}]`,
        pass: false
      };
    }
  },
  toBeOneOf: (received, choices) => {
    if (choices.includes(received)) {
      return {
        message: () => `expected ${received} not to be in [${choices.join(', ')}]`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be in [${choices.join(', ')}]`,
        pass: false
      };
    }
  },
  toHaveTranslate: async (pendingChip, expectedX, expectedY) => {
    const { selector, actualX, actualY } = await pendingChip.evaluate((pendingChipElem) => {
      const translate = pendingChipElem.style.transform;
      return {
        selector: pendingChipElem.nodeName.toLowerCase() + '.' + String(pendingChipElem.className)
          .trim()
          .replace(/\s+/g, '.'),
        actualX: parseFloat(translate.slice(translate.indexOf('(') + 1)),
        actualY: parseFloat(translate.slice(translate.indexOf(',') + 1))
      };
    });
    if (actualX === expectedX && actualY === expectedY) {
      return {
        message: () => `expected ${selector} not to have translate (${expectedX}, ${expectedY}) but got (${actualX}, ${actualY})`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${selector} to have translate (${expectedX}, ${expectedY}) but got (${actualX}, ${actualY})`,
        pass: false
      };
    }
  }
});

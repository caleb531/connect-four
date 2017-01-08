'use strict';

var _ = require('underscore');

// Utilities for cross-browser compatibility.
var Browser = {};

// Map of CSS properties to property names used by the DOM in this browser.
var normalizedProperties = {
  'transform': (function () {
    var property = _.find(['transform', 'WebkitTransform'], function (property) {
      return document.documentElement.style[property] !== undefined;
    });
    if (property) {
      return property;
    }
    return 'transform';
  }())
};

// Convert CSS properties and values to equivalent properties and values for
// this browser.
Browser.normalizeStyles = function (styles) {
  var normalized = {};
  _.keys(styles).forEach(function (property) {
    if (Object.prototype.hasOwnProperty.call(normalizedProperties, property)) {
      normalized[normalizedProperties[property]] = styles[property];
    } else {
      normalized[property] = styles[property];
    }
  });
  return normalized;
};

// Map of DOM event names to event names used by this browser.
var normalizedEventNames = {
  'transitionend': (function () {
    var pair = _.find([
      {property: 'ontransitionend', name: 'transitionend'},
      {property: 'onwebkittransitionend', name: 'webkitTransitionEnd'}
    ], function (pair) {
      return window[pair.property] !== undefined;
    });
    if (pair) {
      return pair.name;
    }
    return 'transitionend';
  }())
};

// Convert a DOM event name to an equivalent event name for this browser.
Browser.normalizeEventName = function (eventName) {
  if (Object.prototype.hasOwnProperty.call(normalizedEventNames, eventName)) {
    return normalizedEventNames[eventName];
  }
  return eventName;
};

module.exports = Browser;

'use strict';

// Run all test files that the application knows about.
window.require.list().filter(function (moduleName) {
  return (/^test\/.*?\.test\.js$/).test(moduleName);
}).forEach(require);

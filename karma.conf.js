/* eslint-env node */

'use strict';

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: ['Chrome'],
    files: ['scripts/modules.js', 'scripts/test.js'],
    frameworks: ['mocha'],
    preprocessors: {
      '**/*.js': ['sourcemap']
    }
  });
};

/* eslint-env node */

'use strict';

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'],
    files: ['scripts/modules.js', 'scripts/test.js'],
    frameworks: ['mocha'],
    preprocessors: {
      '**/*.js': ['sourcemap']
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });
};

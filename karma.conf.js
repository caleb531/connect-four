/* eslint-env node */

'use strict';

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'],
    files: ['scripts/modules.js', 'scripts/test.js'],
    reporters: ['dots'].concat(process.env.COVERAGE ? ['coverage'] : []),
    frameworks: ['mocha'],
    preprocessors: {
      '**/*.js': ['sourcemap'],
      'scripts/modules.js': process.env.COVERAGE ? ['coverage'] : []
    },
    coverageReporter: {
      type: 'json',
      dir: '../coverage/',
      subdir: '.',
      file: 'coverage-unmapped.json'
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });
};

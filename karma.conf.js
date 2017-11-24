/* eslint-env node */

'use strict';

var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'],
    files: ['scripts/modules.js', 'scripts/test.js'],
    reporters: ['dots'].concat(process.env.COVERAGE ? ['coverage'] : []),
    frameworks: ['mocha'],
    middleware: ['static'],
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
    static: {
      path: path.join(__dirname, 'public')
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });
};

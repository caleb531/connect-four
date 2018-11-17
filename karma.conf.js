/* eslint-env node */

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: ['ChromeHeadlessCustom'],
    files: ['styles/index.css', 'scripts/test.js'],
    reporters: ['dots'].concat(process.env.COVERAGE ? ['coverage'] : []),
    frameworks: ['mocha', 'chai-dom', 'sinon-chai'],
    preprocessors: {
      '**/*.js': ['sourcemap'],
      'scripts/test.js': process.env.COVERAGE ? ['coverage'] : []
    },
    coverageReporter: {
      type: 'json',
      dir: '../coverage/',
      subdir: '.',
      file: 'coverage-unmapped.json'
    },
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  });
};

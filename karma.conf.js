/* eslint-env node */

module.exports = function (config) {
  config.set({
    basePath: 'public',
    browsers: ['ChromeHeadlessCustom'],
    files: [
      'styles/index.css',
      'scripts/mithril.min.js',
      'scripts/underscore-min.js',
      'scripts/tinyemitter.min.js',
      'scripts/sw-update-manager.js',
      'scripts/socket.io.min.js',
      'scripts/clipboard.min.js',
      'scripts/test.js'
    ],
    reporters: ['dots'].concat(process.env.COVERAGE ? ['coverage'] : []),
    frameworks: ['mocha', 'chai-dom', 'sinon-chai'],
    plugins: [
      'karma-chai-dom',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-sinon-chai',
      'karma-sourcemap-loader'
    ],
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

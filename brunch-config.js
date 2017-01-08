// Brunch configuration
// See http://brunch.io for documentation.
'use strict';

var modules = ['app/scripts/**/*.js', /^node_modules/];
module.exports = {
  files: {
    javascripts: {
      joinTo: {
        // Create two scripts, each containing application modules.  One has
        // initialization code (main) autoRequire'd, and the other doesn't.  All
        // of the application is loaded in a file (CSP-friendly) and in only one
        // file (latency-friendly) in the browser, and the modules are tested in
        // isolation in unit tests.
        'scripts/main.js': modules,
        'scripts/modules.js': modules,
        'scripts/test.js': ['test/*.js']
      }
    },
    stylesheets: {
      joinTo: {
        'styles/main.css': ['app/styles/main.scss']
      }
    }
  },
  modules: {
    autoRequire: {
      'scripts/main.js': ['app/scripts/main'],
      'scripts/test.js': ['test/main']
    },
    nameCleaner: function (path) {
      // Don't strip "app/" from module paths to ensure ability to require.
      // https://github.com/brunch/brunch/issues/1441#issuecomment-241268612
      return path;
    }
  },
  plugins: {
    postcss: {
      processors: [
        require('autoprefixer')({
          browsers: ['> 0.1%']
        })
      ]
    }
  },
  sourceMaps: 'inline', // For karma-sourcemap-loader.
  overrides: {
    production: {
      paths: {
        // Exclude files in "test" from compilation.
        watched: ['app', 'vendor']
      }
    }
  }
};

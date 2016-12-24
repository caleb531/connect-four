// Brunch configuration
// See http://brunch.io for documentation.
'use strict';

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'scripts/main.js': ['app/scripts/*.js', /^node_modules/],
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

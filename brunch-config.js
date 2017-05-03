// Brunch configuration
// See http://brunch.io for documentation.
'use strict';

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'scripts/main.js': ['app/scripts/**/*.js', /^node_modules/]
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
      'scripts/main.js': ['scripts/main']
    }
  },
  paths: {
    // Exclude test files from compilation
    watched: ['app']
  },
  plugins: {
    copycat: {
      fonts: ['node_modules/typeface-ubuntu/files'],
      verbose: false,
      onlyChanged: true
    },
    postcss: {
      processors: [
        require('autoprefixer')({
          browsers: ['> 0.1%']
        })
      ]
    }
  }
};

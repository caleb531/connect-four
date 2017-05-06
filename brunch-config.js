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
      fonts: [
        'node_modules/typeface-ubuntu/files/ubuntu-latin-400.woff2',
        'node_modules/typeface-ubuntu/files/ubuntu-latin-400.woff',
        'node_modules/typeface-ubuntu/files/ubuntu-latin-400.eot',
        'node_modules/typeface-ubuntu/files/ubuntu-latin-400.svg'
      ],
      verbose: false,
      onlyChanged: true
    },
    postcss: {
      processors: [
        require('autoprefixer')({
          browsers: ['> 0.1%']
        })
      ]
    },
    swPrecache: {
      swFileName: 'service-worker.js',
      options: {
        cacheId: 'connect-four',
        staticFileGlobs: [
          'public/index.html',
          'public/styles/main.css',
          'public/scripts/main.js',
          'public/icons/favicon.png',
          'public/fonts'
        ],
        stripPrefix: 'public',
        replacePrefix: '/connect-four'
      }
    }
  }
};

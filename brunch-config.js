// Brunch configuration
// See http://brunch.io for documentation.

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        // Create two scripts, each containing application modules.  One has
        // initialization code (main) autoRequire'd, and the other doesn't.  All
        // of the application is loaded in a file (CSP-friendly) and in only one
        // file (latency-friendly) in the browser, and the modules are tested in
        // isolation in unit tests.
        'scripts/main.js': [/^node_modules\/(process)/],
        'scripts/modules.js': ['app/scripts/**/*.js', /^node_modules/],
        'scripts/test.js': ['test/**/*.js']
      },
      entryPoints: {
        'app/scripts/main.js': 'scripts/main.js'
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
    babel: {
      presets: ['es2016'],
      plugins: ['babel-plugin-transform-es2015-modules-commonjs']
    },
    // Copy external fonts to build directory
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
    // Automatically add vendor-prefixed CSS declarations
    postcss: {
      processors: [
        require('autoprefixer')({
          browsers: ['> 0.1%']
        })
      ]
    },
    // App icon generator
    rsvg: {
      conversions: [
        {
          input: 'app/icons/favicon.svg',
          output: [
            { width: 32, path: 'icons/favicon.png' }
          ]
        },
        {
          input: 'app/icons/apple-touch-icon.svg',
          output: [
            { width: 76, path: 'icons/apple-touch-icon-76.png' },
            { width: 120, path: 'icons/apple-touch-icon-120.png' },
            { width: 152, path: 'icons/apple-touch-icon-152.png' },
            { width: 180, path: 'icons/apple-touch-icon-180.png' }
          ]
        },
        {
          input: 'app/icons/app-icon.svg',
          outputDefaults: { path: 'icons/app-icon-{width}.png' },
          output: [
            { width: 192 },
            { width: 256 },
            { width: 384 },
            { width: 512 }
          ]
        }
      ]
    },
    // Service worker cache for offline access
    swPrecache: {
      swFileName: 'service-worker.js',
      options: {
        cacheId: 'connect-four',
        staticFileGlobs: [
          'public/index.html',
          'public/styles/main.css',
          'public/scripts/main.js',
          'public/icons/favicon.png',
          'public/fonts/*.*'
        ],
        stripPrefix: 'public',
        replacePrefix: '/connect-four'
      }
    }
  }
};

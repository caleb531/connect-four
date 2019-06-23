let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');
let globImport = require('rollup-plugin-glob-import');

module.exports = {
  input: 'test/index.js',
  output: {
    file: 'public/scripts/test.js',
    name: 'connectFour',
    sourcemap: true,
    format: 'iife',
    globals: {
      'mithril': 'm',
      'underscore': '_',
      'tiny-emitter': 'TinyEmitter',
      'fastclick': 'FastClick',
      'sw-update-manager': 'SWUpdateManager',
      'socket.io-client': 'io',
      'clipboard': 'ClipboardJS'
    }
  },
  external: [
    'mithril',
    'underscore',
    'tiny-emitter',
    'fastclick',
    'sw-update-manager',
    'socket.io-client',
    'clipboard'
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    globImport({
      format: 'import'
    })
  ]
};

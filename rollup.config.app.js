let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');
// let terser = require('rollup-plugin-terser').terser;

module.exports = {
  input: 'app/scripts/index.js',
  output: {
    file: 'public/scripts/index.js',
    name: 'connectFour',
    sourcemap: true,
    format: 'iife',
    globals: {
      'mithril': 'm',
      'underscore': '_',
      'tiny-emitter': 'TinyEmitter',
      'fastclick': 'FastClick',
      'sw-update-manager': 'SWUpdateManager',
      'socket.io-client': 'io'
    }
  },
  external: [
    'mithril',
    'underscore',
    'tiny-emitter',
    'fastclick',
    'sw-update-manager',
    'socket.io-client'
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs(),
    json()
    // terser()
  ]
};

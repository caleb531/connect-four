let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');
let globImport = require('rollup-plugin-glob-import');

module.exports = {
  input: 'test/index.js',
  output: {
    file: 'public/scripts/test.js',
    name: 'flipBook',
    sourcemap: true,
    format: 'iife'
  },
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

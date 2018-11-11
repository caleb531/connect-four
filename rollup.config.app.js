let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');
let uglify = require('rollup-plugin-uglify-es');

module.exports = {
  input: 'app/scripts/index.js',
  output: {
    file: 'public/scripts/index.js',
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
    uglify()
  ]
};

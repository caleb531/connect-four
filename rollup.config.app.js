let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');
let terser = require('rollup-plugin-terser').terser;
let baseConfig = require('./rollup.config.base.js');

module.exports = Object.assign({}, baseConfig, {
  input: 'app/scripts/index.js',
  output: Object.assign({}, baseConfig.output, {
    file: 'public/scripts/index.js'
  }),
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    terser()
  ]
});

let commonjs = require('rollup-plugin-commonjs');
let resolve = require('rollup-plugin-node-resolve');
let json = require('rollup-plugin-json');
let globImport = require('rollup-plugin-glob-import');
let baseConfig = require('./rollup.config.base.js');

module.exports = Object.assign({}, baseConfig, {
  input: 'test/index.js',
  output: Object.assign({}, baseConfig.output, {
    file: 'public/scripts/test.js'
  }),
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
});

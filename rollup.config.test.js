const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const globImport = require('rollup-plugin-glob-import');
const baseConfig = require('./rollup.config.base.js');

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

#!/usr/bin/env node

// Generate an HTML coverage report from a sourcemap-remapped JSON one.

let istanbul = require('istanbul');

let collector = new istanbul.Collector();
let reporter = new istanbul.Reporter();

let remappedJson = require('./coverage/coverage-remapped.json');
let coverage = Object.keys(remappedJson).reduce(function (result, source) {
  // Only keep js files under app/.
  if (/^app\/.*\.js$/.test(source)) {
    result[source] = remappedJson[source];
  }
  return result;
}, {});

collector.add(coverage);

reporter.addAll(['lcov', 'text', 'html']);
reporter.write(collector, true, function () {
  process.stdout.write('Open file://' + __dirname + '/coverage/index.html to see the coverage report.\n');
});

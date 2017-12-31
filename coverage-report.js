#!/usr/bin/env node

// Generate an HTML coverage report from a sourcemap-remapped JSON one.

var istanbul = require('istanbul');

var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter();

var remappedJson = require('./coverage/coverage-remapped.json');
var coverage = Object.keys(remappedJson).reduce(function (result, source) {
  // Only keep js files under app/.
  if (source.match(/^app\/.*\.js$/)) {
    result[source] = remappedJson[source];
  }
  return result;
}, {});

collector.add(coverage);

reporter.addAll(['lcov', 'text', 'html']);
reporter.write(collector, true, function () {
  process.stdout.write('Open file://' + __dirname + '/coverage/index.html to see the coverage report.\n');
});

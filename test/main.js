// Run all test files that the application knows about
window.require.list().filter((moduleName) => {
  return (/^test\/.*?\.spec\.js$/).test(moduleName);
}).forEach(require);

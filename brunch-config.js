// Brunch configuration
// See http://brunch.io for documentation.
module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'scripts/main.js': ['app/scripts/*.js', /^node_modules/]
      }
    },
    stylesheets: {
      joinTo: {
        'styles/main.css': ['app/styles/main.scss']
      }
    }
  }
};

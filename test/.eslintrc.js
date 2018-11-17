// Configured for ESLint 3.15.0

module.exports = {

  /**
   * Allowed JavaScript environments
   */

  env: {

    // adds all of the Mocha testing global variables
    'mocha': true

  },

  /**
   * Allowed global variables
   */
  globals: {

    // expose chai global for assertions
    'chai': true,
    // expose chai statements to test environment, since chai is loaded in as
    // external script
    'expect': true,
    // expose sinon global for mocking
    'sinon': true

  }

};

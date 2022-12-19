import './test/custom-matchers.js';

export default {
  webServer: {
    command: 'npm start',
    url: 'http://localhost:8080/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:8080/'
  }
};

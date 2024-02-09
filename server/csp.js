/* eslint-disable quotes */

// Content Security Policy directives for consumption by Helmet package
// (<https://www.npmjs.com/package/helmet>)
export default {
  'default-src': [
    "'none'"
  ],
  'style-src': [
    "'self'",
    process.env.NODE_ENV !== 'production' ? "'unsafe-inline'" : ''
  ],
  'img-src': [
    "'self'"
  ],
  'font-src': [
    "'self'",
    'data:'
  ],
  'script-src': [
    "'self'"
  ],
  'connect-src': [
    "'self'",
    "ws://localhost:24678",
    "ws://localhost:8080",
    "wss://connectfour.calebevans.me",
    "http://localhost:24678"
  ],
  'manifest-src': [
    "'self'"
  ]
};

/* eslint-disable quotes */

// Content Security Policy directives for consumption by Helmet package
// (<https://www.npmjs.com/package/helmet>)
export default {
  'default-src': [
    "'none'"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:'
  ],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://storage.googleapis.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  'child-src': [
    "'self'"
  ],
  'connect-src': [
    "'self'",
    'ws://localhost:24678',
    'ws://localhost:8080',
    'wss://connectfour.calebevans.me',
    "http://localhost:24678",
    "https://www.google-analytics.com",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com'
  ],
  'manifest-src': [
    "'self'"
  ]
};

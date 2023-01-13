/* eslint-disable quotes */

// Content Security Policy directives for consumption by Helmet package
// (<https://www.npmjs.com/package/helmet>)
export default {
  'default-src': [
    "'none'"
  ],
  'style-src': [
    "'self'",
    process.env.NODE_ENV !== 'production' ? "'unsafe-inline'" : '',
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    'data:'
  ],
  'script-src': [
    "'self'",
    // Inline <script> nonce for Universal Analytics
    (req, res) => `'nonce-${res.locals.uaNonce}'`,
    // Inline <script> nonce for Google Analytics 4
    (req, res) => `'nonce-${res.locals.ga4Nonce}'`,
    "https://storage.googleapis.com",
    "https://plausible.io"
  ],
  'connect-src': [
    "'self'",
    "ws://localhost:24678",
    "ws://localhost:8080",
    "wss://connectfour.calebevans.me",
    "http://localhost:24678",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://plausible.io"
  ],
  'manifest-src': [
    "'self'"
  ]
};

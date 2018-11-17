importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

// The following call will be populated automatically with the precached file
// data during the build step
workbox.precaching.precacheAndRoute([]);

// Cache Google fonts
workbox.routing.registerRoute(new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'), workbox.strategies.cacheFirst({
  cacheName: 'google-fonts',
  plugins: [
    // When the cap is reached, the oldest entries are purged
    new workbox.expiration.Plugin({
      maxEntries: 30
    }),
    // The Google Fonts CSS response is an opaque (non-CORS) response with a
    // status code of 0, so we need to enable caching for that type of response
    new workbox.cacheableResponse.Plugin({
      statuses: [0, 200]
    })
  ]
}));

// When an update to the service worker is detected, the front end will request
// that the service worker be updated immediately; listen for that request here
self.addEventListener('message', (messageEvent) => {
  if (!messageEvent.data) {
    return;
  }
  if (messageEvent.data.updateManagerEvent === 'update') {
    self.skipWaiting();
  }
});

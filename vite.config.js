import { defineConfig } from 'vite';
import { injectManifest } from 'rollup-plugin-workbox';

// https://vitejs.dev/config/
export default defineConfig({
  // By default, Vite will assume we are serving from the root of the domain
  // (i.e. /); however, because we are serving Truthy from a subdirectory of my
  // projects domain (e.g. https://projects.calebevans.me/truthy/), we must
  // specify . as the base directory to serve from
  base: './',
  plugins: [
    injectManifest({
      globDirectory: 'dist',
      globPatterns: [
        '**\/*.{js,css,png}'
      ],
      // Precaching index.html using templatedURLs fixes a "Response served by
      // service worker has redirections" error on iOS 12; see
      // <https://github.com/v8/v8.dev/issues/4> and
      // <https://github.com/v8/v8.dev/pull/7>
      templatedURLs: {
        // '.' must be used instead of '/' because the app is not served from
        // the root of the domain (but rather, from a subdirectory)
        '.': ['index.html']
      },
      swSrc: 'scripts/service-worker.js',
      swDest: 'dist/service-worker.js'
    })
  ]
});

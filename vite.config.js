import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      // Do not inject any SW registration code into the front end application,
      // since we will already be handling this manually
      injectRegister: null,
      workbox: {
        // Add additional file types to be cached by service worker (by default,
        // the servie worker caches *.css, *.js, and *.html; see
        // <https://vite-pwa-org.netlify.app/guide/service-worker-precache.html#precache-manifest>)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        // By default, the filename of the generated service worker is sw.js,
        // but we'd prefer something a bit less ambiguous
        swDest: 'dist/service-worker.js'
      },
      // Web App Manifest (will be generated as manifest.webmanifest; the
      // relevant <link> tag will be automatically added to index.html during
      // build)
      manifest: {
        short_name: 'Connect Four',
        name: 'Connect Four',
        description: 'The slickest way to get 4-in-a-row. Play on your phone or computer, with a friend or against Mr. AI. Just be sure to enjoy and have fun.',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icons/app-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/app-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});

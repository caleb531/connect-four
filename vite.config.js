import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        // Add additional file types to be precached by service worker (by
        // default, the service worker caches *.css, *.js, and *.html; see
        // <https://vite-pwa-org.netlify.app/guide/service-worker-precache.html#precache-manifest>;
        // it's also worth noting that the webmanifest defined later in this
        // file is automatically precached by Vite PWA (i.e. there is no need to
        // include *.webmanifest in the glob patterns list here)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Include Google Fonts in service worker cache
        runtimeCaching: [
          {
            // For reasons unknown, the caching of Google Fonts will break when
            // "https" is present in the regex, so we must omit it; I suspect
            // this is some sort of Workbox v6 bug
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30
              }
            }
          }
        ],
        // A nice-to-have optimization for purging old cache entries after the
        // service worker has updated; see:
        // <https://vite-pwa-org.netlify.app/guide/prompt-for-update.html#cleanup-outdated-caches>
        cleanupOutdatedCaches: true
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
            src: 'icons/app-icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/app-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/app-icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
});

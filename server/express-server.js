import express from 'express';
import compression from 'compression';
import expressEnforcesSSL from 'express-enforces-ssl';
import helmet from 'helmet';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { roomManager } from './room-manager.js';
import { fileURLToPath } from 'url';

// __dirname is not available in ES modules natively, so we must define it
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ensure that we serve the correct index.html path depending upon the
// environment/context
const indexPath = process.env.NODE_ENV === 'production'
  ? path.join(path.dirname(__dirname), 'dist', 'index.html')
  : path.join(path.dirname(__dirname), 'index.html');

// Transform page HTML using both EJS and Vite
async function transformHtml(vite, req, res, htmlPath, params) {
  res.render(htmlPath, params, async (err, html) => {
    if (vite) {
      html = await vite.transformIndexHtml(req.originalUrl, html);
    }
    res.send(html);
  });
}

// Express server
async function createExpressServer() {

  const app = express();

  // Use EJS as view engine, regardless of file extension (i.e. we need
  // index.html instead of index.ejs so Vite can recognize entry point)
  app.set('view engine', 'html');
  app.engine('html', (await import('ejs')).renderFile);

  // Force HTTPS on production
  if (process.env.NODE_ENV === 'production' && !process.env.DISABLE_SSL) {
    app.enable('trust proxy');
    app.use(expressEnforcesSSL());
  }
  app.use(helmet({
    // Helmet's default value of require-corp for Cross-Origin-Embedder-Policy
    // breaks the caching of the Google Fonts CSS via the service worker,
    // supposedly because Google Fonts serves an opaque response for the CSS
    // which, per the nature of opaque responses, is not explicitly marked as
    // loadable from another origin
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        /* eslint-disable quotes */
        'default-src': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com" ],
        'img-src': ["'self'", 'https://www.google-analytics.com', 'https://www.googletagmanager.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'script-src': ["'self'", "'unsafe-inline'", 'https://storage.googleapis.com', 'https://www.google-analytics.com', 'https://www.googletagmanager.com'],
        'child-src': ["'self'"],
        'connect-src': ["'self'", "ws:", "wss:", "http://localhost:24678", "https://www.google-analytics.com", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://www.googletagmanager.com'],
        'manifest-src': ["'self'"]
        /* eslint-enable quotes */
      }
    }
  }));

  // Serve assets using gzip compression
  app.use(compression());

  // Setting vite outside of the conditional so that we can later check if it's
  // undefined (because in Production mode, we don't want to have Vite transform
  // the HTML)
  let vite = null;
  if (process.env.NODE_ENV !== 'production') {
    // I've found that Vite's middleware does not play nicely with the service
    // worker; for example, if they are both active at the same time, Vite's
    // middleware will wrap the app's CSS contents in a JavaScript wrapper when
    // the service worker tries to fetch CSS, thus causing all styles to break
    // (because the associated <link /> tag receives JS, not raw CSS);
    // therefore, we need to remove Vite as the middleman when serving
    // Production so that the service worker can fetch the static files directly
    // (the middleware can be safely disabled in Production because we use Vite
    // to pre-build the project anyway)
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  }

  // Routes

  app.get('/room/:roomCode', async (req, res) => {
    const room = roomManager.getRoom(req.params.roomCode);
    if (room) {
      const inviteeName = (room.players[0] ? room.players[0].name : 'Someone');
      await transformHtml(vite, req, res, indexPath, {
        pageTitle: `${inviteeName} invited you to play!`
      });
    } else {
      await transformHtml(vite, req, res, indexPath, {
        pageTitle: 'Room doesn\'t exist'
      });
    }
  });
  app.get('/room', (req, res) => {
    res.redirect(301, '/');
  });
  // We need to specify /index.html in addition to / so that the service worker
  // caches the index.html file that EJS has already processed via
  // transformHtml()
  app.get(['/', '/index.html'], async (req, res) => {
    await transformHtml(vite, req, res, indexPath, {
      pageTitle: 'Caleb Evans'
    });
  });

  // Vite not being defined implies that NODE_ENV === production, per the
  // createViteServer() conditional earlier in the file
  if (!vite) {
    // Since we changed the name of the service worker when integrating Vite PWA
    // (from service-worker.js to sw.js), we need to preserve backwards
    // compatibility with users whose have already registered with
    // service-worker.js, since they won't ever look for sw.js when checking for
    // updates; we can solve this by making both /sw.js and /service-worker.js
    // point to the same static file on the server
    app.use(
      '/service-worker.js',
      express.static(path.join(path.dirname(__dirname), 'dist', 'sw.js'))
    );
    // We set this *after* the / route above because that / route needs to take
    // precedence (so that Vite/EJS can process index.html)
    app.use(express.static(path.join(path.dirname(__dirname), 'dist')));
  }

  // HTTP server wrapper

  const server = http.Server(app);
  // Warning: app.listen(8080) will not work here; see
  // <https://github.com/socketio/socket.io/issues/2075>
  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started. Listening on port ${server.address().port}`);
  });

  return server;
}

export default createExpressServer;

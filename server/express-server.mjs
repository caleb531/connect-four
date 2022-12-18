import express from 'express';
import compression from 'compression';
import expressEnforcesSSL from 'express-enforces-ssl';
import helmet from 'helmet';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { readFile } from 'fs/promises';
import { roomManager } from './room-manager.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Express server
async function createExpressServer() {

  const app = express();

  // Use EJS as view engine, regardless of file extension (i.e. we need
  // index.html instead of index.ejs so Vite can recognize entry point)
  app.set('view engine', 'html');
  app.engine('html', (await import('ejs')).renderFile);

  // Force HTTPS on production
  if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
    app.use(expressEnforcesSSL());
  }
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        /* eslint-disable quotes */
        'default-src': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'https://www.google-analytics.com', 'https://www.googletagmanager.com'],
        'font-src': ["'self'", 'https://*.gstatic.com', 'data:'],
        'script-src': ["'self'", "'unsafe-inline'", 'https://storage.googleapis.com', 'https://www.google-analytics.com', 'https://www.googletagmanager.com'],
        'child-src': ["'self'"],
        'connect-src': ["'self'", "https://www.google-analytics.com", 'https://www.googletagmanager.com'],
        'manifest-src': ["'self'"]
        /* eslint-enable quotes */
      }
    }
  }));

  // Serve assets using gzip compression
  app.use(compression());

  // Routes

  app.get('/room/:roomCode', async (req, res) => {
    const indexPath = path.join(path.dirname(__dirname), 'index.html');
    const room = roomManager.getRoom(req.params.roomCode);
    if (room) {
      const inviteeName = (room.players[0] ? room.players[0].name : 'Someone');
      res.render(indexPath, {
        pageTitle: `${inviteeName} invited you to play!`
      });
    } else {
      res.render(indexPath, {
        pageTitle: 'Room doesn\'t exist'
      });
    }
  });
  app.get('/room', (req, res) => {
    res.redirect(301, '/');
  });
  app.get('/', (req, res) => {
    const indexPath = path.join(path.dirname(__dirname), 'index.html');
    res.render(indexPath, {
      pageTitle: 'Caleb Evans'
    });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.dirname(__dirname)));
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  }

  // HTTP server wrapper

  const server = http.Server(app);
  // Warning: app.listen(8080) will not work here; see
  // <https://github.com/socketio/socket.io/issues/2075>
  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started. Listening on port ${server.address().port}`);
  });
}

export default createExpressServer;

import m from 'mithril';
import AppComponent from './components/app.js';

// Eliminate the #! for all routes
m.route.prefix = '';

m.route(document.querySelector('main'), '/', {
  '/': AppComponent,
  '/room/:roomCode': AppComponent
});

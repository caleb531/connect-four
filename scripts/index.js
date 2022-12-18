import m from 'mithril';
import AppComponent from './components/app.js';
import '../styles/index.scss';

// Eliminate the #! for all routes
m.route.prefix = '';

m.route(document.querySelector('main'), '/', {
  '/': AppComponent,
  '/room/:roomCode': AppComponent
});

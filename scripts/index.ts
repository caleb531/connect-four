import m from 'mithril';
import '../styles/index.scss';
import AppComponent from './components/app.js';

// Eliminate the #! for all routes
m.route.prefix = '';

m.route(document.querySelector('main') as Element, '/', {
  '/': AppComponent,
  '/room/:roomCode': AppComponent
});

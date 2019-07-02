import m from 'mithril';
import FastClick from 'fastclick';
import AppComponent from './components/app.js';

// Eliminate the #! for all routes
m.route.prefix('');

m.route(document.querySelector('main'), '/', {
  '/': AppComponent,
  '/room/:roomCode': AppComponent
});

FastClick.attach(document.body);

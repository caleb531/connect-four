import m from 'mithril';
import AppComponent from './components/app.jsx';
import '../styles/index.scss';
import '@fontsource/ubuntu/400.css';

// Eliminate the #! for all routes
m.route.prefix = '';

m.route(document.querySelector('main'), '/', {
  '/': AppComponent,
  '/room/:roomCode': AppComponent
});

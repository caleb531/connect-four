import m from 'mithril';
import attachFastClick from 'fastclick';
import AppComponent from './components/app.js';

m.mount(document.querySelector('main'), AppComponent);
attachFastClick(document.body);

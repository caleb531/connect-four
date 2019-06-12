import m from 'mithril';
import FastClick from 'fastclick';
import AppComponent from './components/app.js';

m.mount(document.querySelector('main'), AppComponent);
FastClick.attach(document.body);

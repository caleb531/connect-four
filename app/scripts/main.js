'use strict';

var m = require('mithril');
var attachFastClick = require('fastclick');
var AppComponent = require('./components/app');

m.mount(document.querySelector('main'), AppComponent);
attachFastClick(document.body);

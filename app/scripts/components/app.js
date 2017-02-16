'use strict';

var m = require('mithril');
var GameComponent = require('./game');

var AppComponent = {};

AppComponent.view = function () {
  return m('div#app', [
    m('span#github-link.nav-link.nav-link-left',
      m('a[href=https://github.com/caleb531/connect-four]', 'View on GitHub')
    ),
    m('span#personal-site-link.nav-link.nav-link-right', [
      'by ', m('a[href=https://calebevans.me/]', 'Caleb Evans')
    ]),
    m('h1', 'Connect Four'),
    m(GameComponent)
  ]);
};

module.exports = AppComponent;

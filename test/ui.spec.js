'use strict';

var chai = require('chai');
chai.use(require('chai-dom'));
var expect = chai.expect;
var m = require('mithril');
var GameComponent = require('../app/scripts/components/game');

describe('game UI', function () {

  beforeEach(function () {
    m.mount(document.body, GameComponent);
  });

  afterEach(function () {
    m.mount(document.body, null);
  });

  it('should mount on main', function () {
    m.mount(document.body, null);
    document.body.appendChild(document.createElement('main'));
    require('../app/scripts/main');
    expect(document.querySelector('#game')).not.to.be.null;
    m.mount(document.querySelector('main'), null);
  });

});

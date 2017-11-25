'use strict';

var chai = require('chai');
chai.use(require('chai-dom'));
var expect = chai.expect;
var m = require('mithril');
var GameComponent = require('../app/scripts/components/game');

describe('game UI', function () {

  beforeEach(function () {
    document.body.appendChild(document.createElement('main'));
    m.mount(document.querySelector('main'), GameComponent);
  });

  afterEach(function () {
    m.mount(document.querySelector('main'), null);
  });

  it('should mount on main', function () {
    m.mount(document.querySelector('main'), null);
    document.body.appendChild(document.createElement('main'));
    require('../app/scripts/main');
    expect(document.querySelector('#game')).not.to.be.null;
    m.mount(document.querySelector('main'), null);
  });

  it('should render initial buttons', function () {
    var buttons = document.querySelectorAll('#game-dashboard button');
    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('1 Player');
    expect(buttons[1]).to.have.text('2 Players');
  });

  it('should render initial grid', function () {
    var slots = document.querySelectorAll('.empty-chip-slot');
    expect(slots).to.have.length(42);
  });

  it('should ask for starting player in 1-Player mode', function () {
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    var buttons = document.querySelectorAll('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human');
    expect(buttons[1]).to.have.text('Mr. AI');
  });

  it('should ask for starting player in 2-Player mode', function () {
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    var buttons = document.querySelectorAll('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human 1');
    expect(buttons[1]).to.have.text('Human 2');
  });

  it('should start with Human when chosen in 1-Player mode', function () {
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    var pendingChip = document.querySelector('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with AI when chosen in 1-Player mode', function () {
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    var pendingChip = document.querySelector('.chip.pending');
    expect(pendingChip).to.have.class('black');
  });

  it('should start with Human 1 when chosen in 2-Player mode', function () {
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    var pendingChip = document.querySelector('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with Human 2 when chosen in 2-Player mode', function () {
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    var pendingChip = document.querySelector('.chip.pending');
    expect(pendingChip).to.have.class('blue');
  });

  it('should place chip in first column', function () {
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    var pendingChip = document.querySelector('.chip.pending');
    pendingChip.click();
    m.redraw.sync();
    expect(pendingChip.style.transform).to.equal('translate(0px, 384px)');
  });

});

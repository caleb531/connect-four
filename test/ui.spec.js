'use strict';

var chai = require('chai');
chai.use(require('chai-dom'));
var expect = chai.expect;
var m = require('mithril');
var GameComponent = require('../app/scripts/components/game');

describe('game UI', function () {

  // Wait for the next transition on the given element to complete, timing out
  // and erroring if the transition never completes
  function onPendingChipTransitionEnd(callback) {
    var pendingChip = document.querySelector('.chip.pending');
    pendingChip.addEventListener('transitionend', callback);
    setTimeout(callback, 200);
  }

  // Simulate a mouse event at the specified coordinates, relative to the given
  // element
  function triggerMouseEvent(elem, eventType, x, y) {
    elem.dispatchEvent(new MouseEvent(eventType, {
      clientX: elem.offsetLeft + x,
      clientY: elem.offsetTop + y
    }));
  }

  // Minimize the transition duration to speed up tests (interestingly, a
  // duration of 0ms will prevent transitionEnd from firing)
  before(function () {
    var style = document.createElement('style');
    style.innerHTML = '* {transition-duration: 1ms !important;}';
    document.head.appendChild(style);
  });

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

  it('should align chip to clicked column', function (done) {
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    var grid = document.querySelector('#grid');
    onPendingChipTransitionEnd(function () {
      expect(this.style.transform).to.equal('translate(192px, 0px)');
      done();
    });
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should align chip to hovered column', function (done) {
    document.querySelector('#game-dashboard button:last-of-type').click();
    m.redraw.sync();
    document.querySelector('#game-dashboard button:first-of-type').click();
    m.redraw.sync();
    var grid = document.querySelector('#grid');
    onPendingChipTransitionEnd(function () {
      expect(this.style.transform).to.equal('translate(192px, 0px)');
      done();
    });
    triggerMouseEvent(grid, 'mousemove', 192, 0);
  });

});

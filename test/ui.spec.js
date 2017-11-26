'use strict';

var chai = require('chai');
chai.use(require('chai-dom'));
var expect = chai.expect;
var Assertion = chai.Assertion;
var m = require('mithril');
var GameComponent = require('../app/scripts/components/game');

describe('game UI', function () {

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  // Wait for the next transition on the given element to complete, timing out
  // and erroring if the transition never completes
  function onPendingChipTransitionEnd() {
    return new Promise(function (resolve) {
      var pendingChip = qs('.chip.pending');
      pendingChip.addEventListener('transitionend', function transitionend() {
        pendingChip.removeEventListener('transitionend', transitionend);
        resolve(pendingChip);
      });
    });
  }

  // Simulate a mouse event at the specified coordinates, relative to the given
  // element
  function triggerMouseEvent(elem, eventType, x, y) {
    elem.dispatchEvent(new MouseEvent(eventType, {
      clientX: elem.offsetLeft + x,
      clientY: elem.offsetTop + y
    }));
  }

  // Add syntactic sugar assertion for testing CSS translate values
  Assertion.addMethod('translate', function (expectedX, expectedY) {
    var translate = this._obj.style.transform;
    var actualX = parseFloat(translate.slice(translate.indexOf('(') + 1));
    var actualY = parseFloat(translate.slice(translate.indexOf(',') + 1));
    this.assert(
      actualX === expectedX,
      'expected #{this} to have translateX #{exp} but got #{act}',
      'expected #{this} not to have translateX #{exp}',
      expectedX,
      actualX
    );
    this.assert(
      actualY === expectedY,
      'expected #{this} to have translateY #{exp} but got #{act}',
      'expected #{this} not to have translateY #{exp}',
      expectedY,
      actualY
    );
  });

  // Minimize the transition duration to speed up tests (interestingly, a
  // duration of 0ms will prevent transitionEnd from firing)
  before(function () {
    var style = document.createElement('style');
    style.innerHTML = '* {transition-duration: 200ms !important;}';
    document.head.appendChild(style);
  });

  beforeEach(function () {
    document.body.appendChild(document.createElement('main'));
    m.mount(qs('main'), GameComponent);
  });

  afterEach(function () {
    m.mount(qs('main'), null);
  });

  it('should mount on main', function () {
    m.mount(qs('main'), null);
    document.body.appendChild(document.createElement('main'));
    require('../app/scripts/main');
    expect(qs('#game')).not.to.be.null;
  });

  it('should render initial buttons', function () {
    var buttons = qsa('#game-dashboard button');
    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('1 Player');
    expect(buttons[1]).to.have.text('2 Players');
  });

  it('should render initial grid', function () {
    var slots = qsa('.empty-chip-slot');
    expect(slots).to.have.length(42);
  });

  it('should ask for starting player in 1-Player mode', function () {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human');
    expect(buttons[1]).to.have.text('Mr. AI');
  });

  it('should ask for starting player in 2-Player mode', function () {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    var buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human 1');
    expect(buttons[1]).to.have.text('Human 2');
  });

  it('should start with Human when chosen in 1-Player mode', function () {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with AI when chosen in 1-Player mode', function () {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    var pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('black');
  });

  it('should start with Human 1 when chosen in 2-Player mode', function () {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with Human 2 when chosen in 2-Player mode', function () {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    var pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('blue');
  });

  it('should place chip in initial column', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(0, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 0, 0);
  });

  it('should align chip to clicked column', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);

  });

  it('should place chip after aligning', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should signal AI to place chip on its turn', function (done) {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var grid = qs('#grid');
    // Human's turn
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 384);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        // AI's turn
        expect(pendingChip).to.have.class('black');
        expect(pendingChip).to.have.translate(128, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(128, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should align chip to hovered column', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    var grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'mousemove', 192, 0);
  });

});

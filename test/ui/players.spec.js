import chai from 'chai';
import { expect } from 'chai';
import chaiDom from 'chai-dom';
chai.use(chaiDom);
import m from 'mithril';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { qs, qsa } from './utils.js';

describe('game UI', function () {

  before(_before);
  beforeEach(_beforeEach);
  afterEach(_afterEach);

  it('should ask for starting player in 1-Player mode', function () {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human');
    expect(buttons[1]).to.have.text('Mr. AI');
  });

  it('should ask for starting player in 2-Player mode', function () {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    let buttons = qsa('#game-dashboard button');
    expect(buttons[0]).to.have.text('Human 1');
    expect(buttons[1]).to.have.text('Human 2');
  });

  it('should start with Human when chosen in 1-Player mode', function () {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with AI when chosen in 1-Player mode', function () {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('black');
  });

  it('should start with Human 1 when chosen in 2-Player mode', function () {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('red');
  });

  it('should start with Human 2 when chosen in 2-Player mode', function () {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    let pendingChip = qs('.chip.pending');
    expect(pendingChip).to.have.class('blue');
  });

});

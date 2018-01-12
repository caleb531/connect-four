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

  it('should mount on main', function () {
    m.mount(qs('main'), null);
    document.body.appendChild(document.createElement('main'));
    require('../../app/scripts/main');
    expect(qs('#game')).not.to.be.null;
  });

  it('should render initial buttons', function () {
    let buttons = qsa('#game-dashboard button');
    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('1 Player');
    expect(buttons[1]).to.have.text('2 Players');
  });

  it('should render initial grid', function () {
    let slots = qsa('.empty-chip-slot');
    expect(slots).to.have.length(42);
  });

});

import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { qsa } from './utils.js';

describe('game UI', function () {

  before(_before);
  beforeEach(_beforeEach);
  afterEach(_afterEach);

  it('should render initial buttons', function () {
    const buttons = qsa('#game-dashboard button');
    expect(buttons).to.have.length(2);
    expect(buttons[0]).to.have.text('1 Player');
    expect(buttons[1]).to.have.text('2 Players');
  });

  it('should render initial grid', function () {
    const slots = qsa('.empty-chip-slot');
    expect(slots).to.have.length(42);
  });

});

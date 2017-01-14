'use strict';

var expect = require('chai').expect;
var HumanPlayer = require('../app/scripts/models/human-player');

describe('human player', function () {

  it('should initialize', function () {
    var humanPlayer = new HumanPlayer({
      name: 'Super Player',
      color: 'green'
    });
    expect(humanPlayer).to.have.property('name', 'Super Player');
    expect(humanPlayer).to.have.property('color', 'green');
    expect(humanPlayer).to.have.property('score', 0);
    expect(humanPlayer).to.have.property('type', 'human');
  });

});

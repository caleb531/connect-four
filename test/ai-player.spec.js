'use strict';

var expect = require('chai').expect;
var AIPlayer = require('../app/scripts/models/ai-player');

describe('AI player', function () {

  it('should initialize', function () {
    var aiPlayer = new AIPlayer({
      name: 'HAL',
      color: 'red'
    });
    expect(aiPlayer).to.have.property('name', 'HAL');
    expect(aiPlayer).to.have.property('color', 'red');
    expect(aiPlayer).to.have.property('score', 0);
    expect(aiPlayer).to.have.property('type', 'AI');
  });

});

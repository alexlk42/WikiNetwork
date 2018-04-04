'use strict';
const assert = require('assert');
const WikiData = require('../wikiData');

describe('wikiData', () => {
  it('should run callback', done => {
    WikiData.getForwardLinks('Computer_science', (result) => done());
  });
});

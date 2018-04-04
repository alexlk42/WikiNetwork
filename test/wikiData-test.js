'use strict';
const expect = require('chai').expect;
const WikiData = require('../wikiData');

describe('wikiData', () => {
  it('should run callback when call returns', done => {
    WikiData.callAPI(WikiData.createURLString('links', ['Computer_science']), (result) => done());
  });

  it('should return 5 links', done => {
    WikiData.getForwardLinks('Computer_science', 5, (result) => {
      expect(result).to.have.a.property('query');
      expect(result.query.pages[0].links.length).to.equal(5);
      done();
    });
  });
});

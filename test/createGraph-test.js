'use strict';
const expect = require('chai').expect;
const genGraphJSON = require('../createGraph');

/*
 * Unit test to ensure the correct graph is created
 */
describe ('createGraph', () => {
  it('should create an appropriate JSON file', done=>{
    genGraphJSON(['computer_science', 'mathematics'], 5, res=>{
      expect(res.nodes.length).to.equal(11); //One node is shared by both
      expect(res.links.length).to.equal(10); //Still 10 links in total
      done();
    });
  });
});

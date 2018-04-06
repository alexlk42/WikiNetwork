'use strict';
const expect = require('chai').expect;
const WikiData = require('../wikiData');

describe('wikiData', () => {

  /*
   * Unit test for making sure callAPI() calls its given callback.
   */
  it('should run callback when call returns', done => {
    WikiData.callAPI(WikiData.createURLString('links', ['Computer_science']), (result) => done());
  });

  /*
   * Unit test for making sure getForwardLinks()'s limit param works as expected.
   * Asking for 0 links should cuase no action, which means getForwardLinks()
   * should return false.
   */
  it('should return 0 links', done => {
    let res = WikiData.getForwardLinks('Computer_science', 0, (result) => {});
    expect(res).to.be.flase;
    done();
  });

  /*
   * Unit test for making sure getForwardLinks()'s limit param works as expected.
   * Here we expect to get back exactly 1 link.
   */
  it('should return 1 link', done => {
    let res = WikiData.getForwardLinks('Computer_science', 1, (result) => {
      expect(result).to.be.a('array');
      result.forEach(item => expect(item).to.be.a('string'));
      expect(result).to.have.lengthOf(1);
      done();
    });
    expect(res).to.be.true;
  });

  /*
   * Unit test for making sure getForwardLinks()'s limit param works as expected.
   * Here we expect to get back exactly 5 links.
   */
  it('should return 5 links', done => {
    let res = WikiData.getForwardLinks('Computer_science', 5, (result) => {
      expect(result).to.be.a('array');
      result.forEach(item => expect(item).to.be.a('string'));
      expect(result).to.have.lengthOf(5);
      done();
    });
    expect(res).to.be.true;
  });

  /*
   * Unit test for making sure getForwardLinks()'s limit param works as expected.
   * Here we expect to get back exactly 500 links, even though we are asking for
   * more. 500 is the limit!
   */
  it('should return 500 links', done => {
    let res = WikiData.getForwardLinks('Computer_science', 600, (result) => {
      expect(result).to.be.a('array');
      result.forEach(item => expect(item).to.be.a('string'));
      expect(result).to.have.lengthOf(500);
      done();
    });
    expect(res).to.be.true;
  });

  /*
   * Unit test for making sure getCategories()'s limit param works as expected.
   * Asking for 0 links should cuase no action, which means getCategories()
   * should return false.
   */
  it('should return 0 categories', done => {
    let res = WikiData.getCategories('Computer_science', 0, (result) => {});
    expect(res).to.be.flase;
    done();
  });

  /*
   * Unit test for making sure getCategories()'s limit param works as expected.
   * Here we expect to get back exactly 1 category.
   */
  it('should return 1 category', done => {
    let res = WikiData.getCategories('Computer_science', 1, (result) => {
      expect(result).to.be.a('array');
      result.forEach(item => expect(item).to.be.a('string'));
      expect(result).to.have.lengthOf(1);
      done();
    });
    expect(res).to.be.true;
  });

  /*
   * Unit test for making sure getCategories()'s limit param works as expected.
   * Here we expect to get back exactly 5 categories.
   */
  it('should return 5 categories', done => {
    let res = WikiData.getCategories('Computer_science', 5, (result) => {
      expect(result).to.be.a('array');
      result.forEach(item => expect(item).to.be.a('string'));
      expect(result).to.have.lengthOf(5);
      done();
    });
    expect(res).to.be.true;
  });

  /*
   * Unit test for making sure getCategories()'s limit param works as expected.
   * Here we expect to get back exactly 50 categories, even though we are asking for
   * more. 50 is the limit!
   */
  it('should return 50 categories', done => {
    let res = WikiData.getCategories('Elon Musk', 60, (result) => {
      expect(result).to.be.a('array');
      result.forEach(item => expect(item).to.be.a('string'));
      expect(result).to.have.lengthOf(50);
      done();
    });
    expect(res).to.be.true;
  });

  /*
   * Unit test for making sure getDescription() works as expected.
   */
  it ('should return the correct description for the CS page', done => {
    let res = WikiData.getDescription('Computer_science', (result) => {
      expect(result).to.be.a('string');
      done();
    });
    expect(res).to.be.true;
  });
});

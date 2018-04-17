'use strict';
const expect = require('chai').expect;
const WikiNode = require('../wikiNode');

describe ('wikiNode', () => {

  /*
  * Unit test to ensure it properly constructs a node
  */
  it('should construct a node with a given title, 0 branches, and empty attributes', done=> {

    let testnode = new WikiNode('computer_science');
    expect(testnode.title).to.be.a('string');
    expect(testnode.branches).to.equal(0);
    expect(testnode.forwardLinks).to.be.empty;
    expect(testnode.categories).to.be.empty;
    expect(testnode.description).to.be.empty;
    done();
  });

  /*
   * Unit test to make sure we can change the number of branches
   */
  it('should be able to have its branch number changed', done=> {
    let testnode = new WikiNode('computer_science');
    testnode.setBranch(3);
    expect(testnode.branches).to.equal(3);
    done();
  });

  /*
   * Unit test to make sure that no links are found when branches is set to 0.
   */
  it('should find links when branches is set to non-0', done=>{
    let testnode = new WikiNode('computer_science');
    testnode.findForwardLinks(()=>{
      expect(testnode.forwardLinks).to.be.empty;
      done();
    });
  });
  
  /*
   * Unit test to make sure we can change the number of categories
   */
  it('should be able to have its category number changed', done=> {
    let testnode = new WikiNode('computer_science');
    testnode.setCategoryNum(3);
    expect(testnode.categoryNum).to.equal(3);
    done();
  });

  /*
   * Unit test to make sure that no categories are found when categoryNum is set to 0.
   */
  it('should not find categories when categoryNum is set to 0', done=>{
    let testnode = new WikiNode('computer_science');
    testnode.findCategories(()=>{
      expect(testnode.categories).to.be.empty;
      done();
    });
  });

  /*
   * Unit test to make sure that the correct number of categories are found when branches is not set to 0.
   */
  it('should find categories when categoryNum is set to non-0', done=>{
    let testnode = new WikiNode('computer_science');
    testnode.setCategoryNum(3);
    testnode.findCategories(()=>{
      expect(testnode.categories.length).to.equal(3);
      done();
    });
  });

  /*
   * Unit test to make sure findDescription returns an appropriate value
   */
  it('should return a string when findDescription is called', done=>{
    let testnode = new WikiNode('computer_science');
    testnode.findDescription(()=>{
      expect(testnode.description).to.be.a('string');
      done();
    });
  });


  /*
   * Unit test to make sure that the correct number of links are found when branches is not set to 0.
   */
  it('should not find links when branches is set to 0', done=>{
    let testnode = new WikiNode('computer_science');
    testnode.setBranch(3);
    testnode.findForwardLinks(()=>{
      expect(testnode.forwardLinks.length).to.equal(3);
      done();
    });
  });

  /*
   * Unit test to make sure createIDArr behaves well with an empty array
   */
  it('should not crash when createIDArr is given an empty array', done=>{
    let res = [];
    res = WikiNode.createIDArr([]);
    expect(res).to.be.empty;
    done();
  });

  /*
   * Unit test to make sure createIDArr behaves correctly with a non-empty array
   */
  it('should create an array with the correct number of elements when createIDArr is given a non-empty array', done=>{

    let testnode = new WikiNode('computer_science');
    let testnode1 = new WikiNode('Denver');

    let done0 = 0;
    let done1 = 0;

    let res=[];

    testnode.setBranch(3); //3 branches on 0
    testnode1.setBranch(4); //4 on 1, giving 9 nodes in total

    testnode.findForwardLinks(()=>{
      done0 = 1;
      if (done1){
	res = WikiNode.createIDArr([testnode,testnode1]);
	expect(res.length).to.equal(9);
	done();
      }
    });
    testnode1.findForwardLinks(()=>{
      done1 = 1;
      if (done0){
	res = WikiNode.createIDArr([testnode,testnode1]);
	expect(res.length).to.equal(9);
	done();
      }
    });   
  });

  /*
   * Unit test to make sure createLinksArr behaves well with an empty array
   */
  it('should not crash when createLinksArr is given an empty array', done=>{
    let res = WikiNode.createLinksArr([]);
    expect(res).to.be.empty;
    done()
  });

  /*
   * Unit test to make sure createLinksArr behaves correctly with a non-empty array
   */
  it('should create an array with the correct number of elements when createLinksArr is given an empty array', done=>{

    let testnode = new WikiNode('computer_science');
    let testnode1 = new WikiNode('Denver');

    let done0 = 0;
    let done1 = 0;

    let res=[];

    testnode.setBranch(3); //3 branches on 0
    testnode1.setBranch(4); //4 on 1, giving 7 links in total

    testnode.findForwardLinks(()=>{
      done0 = 1;
      if (done1){
	res = WikiNode.createLinksArr([testnode,testnode1]);
	expect(res.length).to.equal(7);
	done();
      }
    });
    testnode1.findForwardLinks(()=>{
      done1 = 1;
      if (done0){
	res = WikiNode.createLinksArr([testnode,testnode1]);
	expect(res.length).to.equal(7);
	done();
      }
    });   
  });

  /*
   * Unit test to make sure nodeArrayPrint behaves well with an empty array
   */
  it('should not crash when nodeArrayPrint is given an empty array', done=>{
    WikiNode.nodeArrayPrint([], res=>{
      expect(res.nodes).to.be.empty;
      expect(res.links).to.be.empty;
      done();
    });
  });

  /*
   * Unit test to make sure nodeArrayPrint behaves correctly with a non-empty array
   */
  it('should create an array with the correct number of elements when nodeArrayPrint is given a non-empty array', done=>{

    let testnode = new WikiNode('computer_science');
    let testnode1 = new WikiNode('Denver');

    let done0 = 0;
    let done1 = 0;

    testnode.setBranch(3); //3 branches on 0
    testnode1.setBranch(4); //4 on 1, giving 7 links in total

    testnode.findForwardLinks(()=>{
      done0 = 1;
      if (done1){
	WikiNode.nodeArrayPrint([testnode,testnode1],res=>{
	  expect(res.nodes.length).to.equal(9);
	  expect(res.links.length).to.equal(7);
	  done();
	});
      }
    });
    testnode1.findForwardLinks(()=>{
      done1 = 1;
      if (done0){
	WikiNode.nodeArrayPrint([testnode,testnode1],res=>{
	  expect(res.nodes.length).to.equal(9);
	  expect(res.links.length).to.equal(7);
	  done();
	});
      }
    });   
  });
});

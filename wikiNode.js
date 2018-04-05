'use strict';
const WikiData = require('./wikiData');

/****************
 *
 * This class describes the "nodes" that exist on the graph.
 * It acts as a bridge between the wikiData class, which
 * retrieves the necessary data from Wikipedia, and our
 * implementation of the graph in D3.
 *
 * *****************/
class WikiNode {

  /* constructor
   * Creates a node with the given title.
   * Also creates the corresponding WikiData class.
   * The number of branches off of this node is set to 0
   * as a default.
   */
  constructor(title){
    this.title = title;
    this.branches = 0; //default to 0
    this.forwardLinks = [];
    this.categories = [];
    this.description = '';
  }

  // Update branch number
  setBranch(num){
    this.branches = num;
  }

  // Find forwardLinks
  findForwardLinks(callback) {
    WikiData.getForwardLinks(this.title, this.branches, result => {
      this.forwardLinks = result;
      callback();
    });
  }

  // Find categories
  findCategories(callback){
    WikiData.getCategories(this.title, result => {
      this.categories = result;
      callback();
    });
  }

  // Find description
  findDescription(callback){
    WikiData.getDescription(this.title, result => {
      this.description = result;
      callback();
    });
  }

  // JSON stringify
  toJSON() {
    return {
      title: this.title,
      branches: this.branches,
      forwardLinks: this.forwardLinks,
      categories: this.categories,
      description: this.description
    };

  }

  /*
   * The following static methods are used to
   * generate an appropriate JSON file from an array
   * of nodes.
   */

  //Creates the first half of the JSON including
  //all titles
  static createIDArr(nodeArray){
    let idArr = [];
    nodeArray.forEach(node=>{
      idArr.push(JSON.stringify({ id: node.title}))
    });
    return idArr;
  }

  //Creates the second half of the JSON including
  //all links
  static createLinksArr(nodeArray){
    let linksArr = [];
    nodeArray.forEach(node=>{
      links = node.forwardLinks;
      links.forEach(link=>{
	linksArr.push(JSON.stringify({
	  source: node.title,
	  target: link,
	  value: 1
	}));
      });
    });
    return linksArr;
  }

  //combines the first and second half of the JSON
  static nodeArrayPrint(nodeArray,callback){
    let fullString = JSON.stringify({
      nodes: createIDArr(nodeArray),
      links: createLinksArr(nodeArray)
    });
    callback(fullString);
  }
}

module.exports = WikiNode;

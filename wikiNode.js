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
    this.url = '';
    this.branches = 0; //default to 0
    this.forwardLinks = [];
    this.categories = [];
    this.categoryNum = [];
    this.description = '';
  }

  // Update branch number
  setBranch(num){
    this.branches = num;
  }

  // Update category number
  setCategoryNum(num){
    this.categoryNum = num;
  }

  // Find forwardLinks
  findForwardLinks(callback) {

    if (this.branches==0){ //doesn't ask for links if 0
      callback();

    }else{ //Create new nodes for each link
      WikiData.getForwardLinks(this.title, this.branches, result => {
	var links = result;
	links.forEach(link=>{
	  this.forwardLinks.push(new WikiNode(link));
	});
	callback();
      });
    }
  }

  // Find categories
  findCategories(callback){
    if (this.categoryNum==0){
      callback();
    }else{
      WikiData.getCategories(this.title, this.categoryNum, result => {
	this.categories = result;
	callback();
      });
    }
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
  static createIDArr(nodeArray,callback){
    let idArr = [];
    let titles = []; //list of already created titles

    nodeArray.forEach(node=>{
      if (titles.indexOf(node.title) == -1){
	titles.push(node.title);
	idArr.push({id: node.title});
      }
      var links = node.forwardLinks;
      links.forEach(link=>{
	if (titles.indexOf(link.title) == -1){
	  titles.push(link.title);
	  idArr.push({id: link.title});
	}
      });
    });
    callback(idArr);
  }

  //Creates the second half of the JSON including
  //all links
  static createLinksArr(nodeArray,callback){
    let linksArr = [];
    nodeArray.forEach(node=>{
      var links = node.forwardLinks;
      links.forEach(link=>{
	linksArr.push({
	  source: node.title,
	  target: link.title,
	});
      });
    });
    callback(linksArr);
  }

  //combines the first and second half of the JSON
  static nodeArrayPrint(nodeArray,callback){
    var fullString={};
    WikiNode.createIDArr(nodeArray, res=>{
      fullString['nodes']=res;
    });
    WikiNode.createLinksArr(nodeArray, res=>{
      fullString['links']=res;
    });

    callback(fullString);
  }
}

module.exports = WikiNode;

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
   * The number of branches off of this node is set to 0
   * as a default.
   */
  constructor(title, hops){
    this.title = title;
    this.url = '';
    this.branches = 0; //default to 0
    this.forwardLinks = [];
    this.categories = [];
    this.categoryNum = [];
    this.description = '';
    this.hops = hops;
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
  async findForwardLinks() {
    try {
        let links = await WikiData.getForwardLinks(this.title, this.branches);
        links.forEach(link => {
            this.forwardLinks.push(new WikiNode(link, this.hops + 1));
        });
    } catch (err) {
        console.error(err);
    }
  }

  // Find categories
  async findCategories(){
    try {
        this.categories = await WikiData.getCategories(this.title, this.categoryNum);
    } catch (err) {
        console.error(err);
    }
  }

  // Find description
  async findDescription() {
    try {
        this.description = await WikiData.getDescription(this.title);
    } catch (err) {
        console.error(err);
    }
  }

  // Find URL
  async findURL() {
    try {
        this.url = await WikiData.getURL(this.title);
    } catch (err) {
        console.error(err);
    }
  }

  // JSON stringify
  toJSON() {
    return {
      title: this.title,
      url: this.url,
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
    let titles = []; //list of already created titles

    nodeArray.forEach(node=>{
      let modtitle = node.title.replace("_", " ");
      if (titles.indexOf(modtitle) == -1){
	titles.push(modtitle);
	idArr.push({id: modtitle, categories: node.categories, url: node.url, description: node.description});
      }
      var links = node.forwardLinks;
      links.forEach(link=>{
	let modlinktitle = link.title.replace("_", " ");
	if (titles.indexOf(modlinktitle) == -1){
	  titles.push(modlinktitle);
	  idArr.push({id: modlinktitle, categories: link.categories, url: link.url, description: link.description});
	}
      });
    });
    return idArr;
  }

  //Creates the second half of the JSON including
  //all links
  static createLinksArr(nodeArray){
    let linksArr = [];
    nodeArray.forEach(node=>{
      var links = node.forwardLinks;
      links.forEach(link=>{
	linksArr.push({
	  source: node.title.replace("_", " "),
	  target: link.title.replace("_", " "),
	});
      });
    });
    return linksArr;
  }

  //combines the first and second half of the JSON
  static nodeArrayPrint(nodeArray) {
    var fullString={};

    fullString['nodes'] = WikiNode.createIDArr(nodeArray);
    fullString['links'] = WikiNode.createLinksArr(nodeArray);

    return fullString;
  }
}

module.exports = WikiNode;

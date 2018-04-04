/****************
 *
 * This class describes the "nodes" that exist on the graph.
 * It acts as a bridge between the WikiData class, which
 * retrieves the necessary data from Wikipedia, and our
 * implementation of the graph in D3.
 *
 * *****************/
class wikiNode {

  /* constructor
   * Creates a node with the given title.
   * Also creates the corresponding WikiData class.
   * The number of branches off of this node is set to 0
   * as a default.
   */
  constructor(title){
    this.title = title;
    this.data = new WikiData(); //Creates WikiData class for retrieving data
    this.branches = 0; //default to 0
  }

  // Update branch number
  setBranch(num){
    this.branches = num;
  }

  // forwardLinks getter
  get forwardLinks() {
    return this.findForwardLinks(num);
  }

  // forwardLinks Method
  findForwardLinks(num) {
    if (num==0){
      console.error('Branch number is currently set to 0 for this node, cannot get next nodes');
      return;
    }else{
      res = [];
      this.data.getForwardLinks(this.title, num, result => {
	links = result.query.pages[0].links;
	links.forEach(link => res.push(link.title));
      });
      return res;
    }

  }

}

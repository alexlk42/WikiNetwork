/*This module drives the wikiNode class to create
 * a series of connected nodes that represent the
 * desired graph. It exports the genGraphJSON function
 * which should be used to create a JSON file representing
 * the desired graph.
 */

const WikiNode = require('./wikiNode');
const WikiData = require('./wikiData');

const fs = require('fs');

/*This function recursively finds the relevant information
 * for a node and all its linked nodes.
 */
const getLinkData = async function(node, branches, nodes, numHops){

  metapromises = [node.setCategoryNum(5),
		  node.findURL(),
		  node.findCategories(),
		  node.findDescription()]; //metadata

  /*If we have not reached our maximum number of hops
   * yet, find the linked nodes and retrieve their data
   */
  if (node.hops < numHops){
    nodes.push(node);
    node.setBranch(branches);
    await node.findForwardLinks();

    let links = node.forwardLinks;
    const promises = links.map(async link=>{
      await getLinkData(link, branches, nodes, numHops);
    });
    await Promise.all(promises);
  }
  try{
    await Promise.all(metapromises);
  }catch(err){
    console.error(err);
  }
}

/*Main function for creating a JSON of the graph.
 * Takes an array of center node titles, the number of
 * branches for each node, and the number of hops away
 * the graph should extend. Returns a JSON containing
 * the necessary information for the graph.
 */
const genGraphJSON = async function (titles, branches, numHops){

  nodeCount = titles.length; //how many nodes to create
  nodes = []; //collection of nodes with linked children

  const promises = titles.map(async node=>{
    await getLinkData(new WikiNode(node,0), branches, nodes, numHops);
  });

  try{
    await Promise.all(promises);
    return WikiNode.nodeArrayPrint(nodes);
  }catch(err){
    console.error(err);
  }
}

/*Functionality for running from the command line.
 * Usage: node.js createGraph.js <titles> <branches> <numHops>
 * titles can be any number of Wikipedia page titles
 * branches and numHops should be integers
 * saves a JSON representing the graph as graph.json
 */
if (require.main===module){

  argNum = process.argv.length;

  if (argNum>=5 && !isNaN(Number(process.argv[argNum-1]))){
    let res = genGraphJSON(process.argv.slice(2, argNum-2), process.argv[argNum-2], process.argv[argNum-1]);
    fs.writeFile("graph.json",JSON.stringify(res));

  }else{
    console.error('Usage: node.js createGraph.js <titles> <branches> <numHops>');
  }
}

module.exports = genGraphJSON;

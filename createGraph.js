const WikiNode = require('./wikiNode');
const WikiData = require('./wikiData');

const fs = require('fs');
const MAX_HOPS = 3;

const getLinkData = async function(node, branches, nodes){
  
  await node.setCategoryNum(5);
  await node.findURL();
  await node.findCategories();
  await node.findDescription();

  if (node.hops < MAX_HOPS){
    nodes.push(node);
    node.setBranch(branches);
    await node.findForwardLinks();
    let links = node.forwardLinks;
    const promises = links.map(async link=>{
      await getLinkData(link, branches, nodes);
    });
    await Promise.all(promises);
  }
}

const genGraphJSON = async function (titles, branches, callback){

  nodeCount = titles.length; //how many nodes to create
  nodes = new Array(nodeCount);

  const promises = titles.map(async node=>{
    await getLinkData(new WikiNode(node,0), branches, nodes);
  });
  try{
    await Promise.all(promises);
    callback(WikiNode.nodeArrayPrint(nodes));
  }catch(err){
    console.error(err);
  }
}

if (require.main===module){ //being run from console
  argNum = process.argv.length;
  if (argNum>=4 && !isNaN(Number(process.argv[argNum-1]))){
    genGraphJSON(process.argv.slice(2, argNum-1), process.argv[argNum-1], res=>{
      fs.writeFile("graph.json",JSON.stringify(res));
    });
  }else{
    console.error('Usage: node.js createGraph.js <titles> <branches>');
  }
}

module.exports = genGraphJSON;

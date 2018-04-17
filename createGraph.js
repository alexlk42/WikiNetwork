const WikiNode = require('./wikiNode');
const WikiData = require('./wikiData');

const fs = require('fs');

const getAllData = async function(node,branches){
  try{
    node.setBranch(branches);
    node.setCategoryNum(5);
    await node.findURL();
    await node.findForwardLinks();
    await node.findCategories();
    await node.findDescription();
  }catch (err){
    console.error(err)
  }
}
const getLinkData = async function(node){
  let links = node.forwardLinks;
  try{
    const promises = links.map(async link=>{
      link.setCategoryNum(5);
      await link.findURL();
      await link.findCategories();
      await link.findDescription();
    });
    await Promise.all(promises);
  }catch (err){
    console.error(err)
  }

}

const genGraphJSON = async function (titles, branches, callback){

  nodeCount = titles.length; //how many nodes to create
  nodes = new Array(nodeCount);

  var i;
  for (i=0; i<nodeCount; i++){ //for every node
    nodes[i] = new WikiNode(titles[i]); //create the nodes
  }
  const promises = nodes.map(async node=>{
    await getAllData(node, branches);//get data for each node
    await getLinkData(node);
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

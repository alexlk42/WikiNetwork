const WikiNode = require('./wikiNode');
const WikiData = require('./wikiData');

const fs = require('fs');

const genGraphJSON = function (titles, branches, callback){

  nodeCount = titles.length; //how many nodes to create
  nodes = new Array(nodeCount);
  done = 0;

  var i;
  for (i=0; i<nodeCount; i++){ //for every node
    nodes[i] = new WikiNode(titles[i]); //create the node
    nodes[i].setBranch(branches); //set the branches
    nodes[i].findForwardLinks().then(()=>{
      done = done+1;
      if (done==nodeCount){ //all have been completed
	WikiNode.nodeArrayPrint(nodes, res=>{
	  callback(res);
	});
      }
    }); //find the links
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

const WikiNode = require('./wikiNode');
const WikiData = require('./wikiData');

const fs = require('fs');

const genGraphJSON = function (titles, branches, callback){

  nodeCount = titles.length; //how many nodes to create
  nodes = new Array(nodeCount);
  doneL = 0;
  doneC = 0;

  var i;
  for (i=0; i<nodeCount; i++){ //for every node
    nodes[i] = new WikiNode(titles[i]); //create the node
    nodes[i].setBranch(branches); //set the branches
    nodes[i].setCategoryNum(5); //hardcode for now
    nodes[i].findForwardLinks().then(()=>{
      doneL = doneL+1;
      if (doneL==nodeCount && doneC==nodeCount){ //all have been completed
	WikiNode.nodeArrayPrint(nodes, res=>{
	  callback(res);
	});
      }
    }); //find the links
    nodes[i].findCategories().then(()=>{
      doneC = doneC+1;
      if (doneL==nodeCount && doneC==nodeCount){ //all have been completed
	WikiNode.nodeArrayPrint(nodes, res=>{
	  callback(res);
	});
      }
    }); //find the categories
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

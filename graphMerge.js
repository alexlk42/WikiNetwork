/*This module combines two graph JSONs into a single one.*/

const wikiNode = require('./wikiNode');

const joinGraphs = async function (oldJSON, newJSON){

  const oldIDs = oldJSON['nodes'].map(node=>node.id);
  const oldLinks = oldJSON['links'];
  const oldSources = oldLinks.map(link=>link.source);
  const oldTargs = oldLinks.map(link=>link.target);

  const idPromises = newJSON['nodes'].map(async node=>{
    let id = node.id;
    if (oldIDs.indexOf(id) == -1){
      oldJSON['nodes'].push(node);
    }
  });

  const linkPromises = newJSON['links'].map(async link=>{
    console.log(oldSources[oldTargs.indexOf(link.target)]);
    targIndex = oldTargs.indexOf(link.target);
    if(targIndex == -1 || oldSources[targIndex]!=link.source){
      oldJSON['links'].push(link);
    }
  });
  await Promise.all(idPromises);
  await Promise.all(linkPromises);

  console.log(oldJSON);
}

module.exports = joinGraphs;

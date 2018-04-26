/*This function combines two graph JSONs into a single one.
 * It takes the old JSON file and the new one to be merged
 * onto it, and returns a combined version.
 * The function is written so that there are no repeats
 * in nodes or links in the resulting JSON.
 * The module exports the joinGraphs function. */
const joinGraphs = async function (oldJSON, newJSON){

  //Data from the old JSON
  const oldIDs = oldJSON['nodes'].map(node=>node.id);
  const oldLinks = oldJSON['links'];
  const oldSources = oldLinks.map(link=>link.source);
  const oldTargs = oldLinks.map(link=>link.target);

  //Add all new nodes
  const idPromises = newJSON['nodes'].map(async node=>{
    let id = node.id;
    if (oldIDs.indexOf(id) == -1){ //node is new
      oldJSON['nodes'].push(node);
    }
  });

  //Add all new links
  const linkPromises = newJSON['links'].map(async link=>{

    targIndex = oldTargs.indexOf(link.target);

    /*Need to check for matching source and target*/
    if(targIndex == -1 || oldSources[targIndex]!=link.source){
      oldJSON['links'].push(link);
    }
  });

  //Wait for both changes to finish
  await Promise.all(idPromises);
  await Promise.all(linkPromises);

  return oldJSON;
}

module.exports = joinGraphs;

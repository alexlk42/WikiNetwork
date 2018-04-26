/****************
 *
 * This code was heavily inspired by Mike Bostock's implementation of a
 * force-directed graph layout in D3: https://bl.ocks.org/mbostock/4062045.
 *
 * *****************/

var d3Color;
var d3Simulation;

function initD3(svg)
{
  var width = +svg.attr("width");
  var height = +svg.attr("height");

  // For node color options
  d3Color = d3.scaleOrdinal(d3.schemeCategory20);

  // Define the graph layout
  d3Simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
}

function displayGraph(svg, json) {

  // Convert json to a proper graph object
  var graph = JSON.parse(json);

  // Clear the svg viewport
  $("#viewport").empty();

  // Categories come with "Category:" prefixed.
  // Let's remove it because it isn't useful to us.
  graph.nodes.forEach(function(part_i, i) {
    part_i.categories.forEach(function(part_j, j) {
      graph.nodes[i].categories[j] = part_j.replace("Category:", "");
    })
  });

  var canvas = svg.call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
    }))
    .append("g")
    .attr("class", "canvas");;

  // Add the links to the graph `g`
  var link = canvas.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return 1; });

  // Add the nodes to the graph `g`
  var node = canvas.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("fill", function(d) { return d3Color(1); })
      .call(d3.drag() // Allow for nodes to be moved
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
          )
      .on("click", handleClick)
      .on("dblclick", handleDblClick);

  // Add the id from the JSON as a title tag to each node.
  // Enables hover-over with label
  node.append("title")
      .text(function(d) { return d.id; });

  // Add the nodes and links to the simulation
  d3Simulation
      .nodes(graph.nodes)
      .on("tick", ticked) ;

  d3Simulation.force("link")
      .links(graph.links);

  // Redraws the links and nodes
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  // Support zooming (two finger scroll) and
  // panning (drag on canvas)
  var handleZoom = d3.zoom()
    .on("zoom", zoomed);

  function zoomed(){
    canvas.attr("transform", d3.event.transform);
  }

  handleZoom(svg);
}

function dragstarted(d) {
  if (!d3.event.active) d3Simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) d3Simulation.alphaTarget(0);
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function handleDblClick(d,i){
  d.fx = null;
  d.fy = null;
}

function handleClick(d,i){
  // Add this node's metadata to the sidebar
  d3.select("#nodename")
    .text("Name: " + d.id);
  d3.select("#nodeurl")
    .html("URL: <a target='_blank' href='" + d.url + "'>Wiki Link</a>");

  // Drop the category information into a list
  var ul = d3.select("#nodecategories")
    .html("Categories: <ul></ul>")
    .selectAll('li')
    .data(d.categories)
    .enter()
    .append('li')
    .html(String);

  d3.select("#nodedescription")
    .text("Description: " + d.description);

  //d3.select(this).node().remove(); // This will remove the node upon click

  // Reset all nodes back to original state
  d3.selectAll("circle")
    .attr("fill", function(d) { return d3Color(1); })
    .attr("id", null)
    .attr("r", 5);

  // Modify selected node when clicked
  d3.select(this)
    .transition()
    .attr('fill', '#ff0000')
    .attr("r", 8)
    .attr("nodeValue" , "selected")
    .attr("id", "selected");

  // Reset all lines back to original state
  d3.selectAll("line")
    .attr("id", null)
    .attr("stroke-width", function(d) { return 1; });

  //Modify target lines of selected node
  d3.selectAll("line")
    .filter(function(m){ return m.target.id === d.id; })
    .transition()
      .attr('fill', '#ff0000')
      .attr("id", "selectedline")
      .attr("stroke-width", function(d) { return 5; });

  //Modify source lines of selected node
  d3.selectAll("line")
    .filter(function(m){ return m.source.id === d.id; })
    .transition()
      .attr('fill', '#ff0000')
      .attr("id", "selectedline")
      .attr("stroke-width", function(d) { return 5; });

}

function handleDelete(d,i){

   d3.selectAll("#selected").remove();
   d3.selectAll("#selectedline").remove();

   //d3.selectAll("circle").node().remove();//this removes random nodes but leaves links

   //d3.selectAll("line").node().remove();//this removes random links

}

function handleNodeSearch() {

  // Get node name of interest
  var nodeName = $("#nodeSearchField").val();

  // Search graph for node of interest.
  d3.selectAll(".node").each(function(d, i) {
    if (d.id === nodeName) {
      d3.select(this)
        .transition()
        .attr('fill', '#00ff00')
        .attr("r", 8)
    } else {
      d3.select(this)
        .attr("fill", function(d) { return d3Color(1); })
        .attr("id", null)
        .attr("r", 5);
    }
  });
}

<<<<<<< HEAD
var d3 = require("d3");

=======
// Select the SVG object we have created in `force_directed.html`
>>>>>>> develop
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

<<<<<<< HEAD
var color = d3.scaleOrdinal(d3.schemeCategory20);

=======
// For node color options
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Define the graph layout
>>>>>>> develop
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

<<<<<<< HEAD
d3.json("example.json", function(error, graph) {
  if (error) throw error;

=======
// Read in the `example.json` file
d3.json("example.json", function(error, graph) {
  if (error) throw error;

  // Add the links to the graph `g`
>>>>>>> develop
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
<<<<<<< HEAD
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

=======
      .attr("stroke-width", function(d) { return 1; });

  // Add the nodes to the graph `g`
>>>>>>> develop
  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(1); })
<<<<<<< HEAD
      .call(d3.drag()
=======
      .call(d3.drag() // Allow for nodes to be moved
>>>>>>> develop
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

<<<<<<< HEAD
  node.append("title")
      .text(function(d) { return d.id; });

=======
  // Add the id from the JSON as a title tag to each node.
  // Enables hover-over with label
  node.append("title")
      .text(function(d) { return d.id; });

  // Add the nodes and links to the simulation
>>>>>>> develop
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

<<<<<<< HEAD
=======
  // Redraws the links and nodes
>>>>>>> develop
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
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
/*
 * CSCI 5828 - Spring 2018
 * Team 1
 */

// Setup express
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname));

// Get ref to createGraph module
const genGraphJSON = require('./createGraph');

/*
 * Main Wiki Network routing.
 */
app.get('/wikinetwork.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "wikinetwork.htm" );
})

/*
 * Fetch graph routing.
 */
app.get('/fetch_graph', async function (req, res) {
        let centerTitle = req.query.title;
        let branches = +req.query.branches;
        let numHops = +req.query.hops;
	let graph = await genGraphJSON([centerTitle], branches, numHops);
	res.send(JSON.stringify(graph));
})

/*
 * Root routing. Simply redirects to wikinetwork.htm.
 */
app.get('/', (req, res) => {
  res.redirect('/wikinetwork.htm');
});

/*
 * Listen on port 3000.
 */
app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

/*
 * CSCIC 5828 - Spring 2018
 * Team 1
 *
 */

var express = require('express');
var app = express();
const WikiData = require('./wikiData');
const genGraphJSON = require('./createGraph');
const joinGraphs = require('./graphMerge');

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.use(express.static(__dirname + '/css'));

app.use(express.static(__dirname));

app.get('/wikinetwork.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "wikinetwork.htm" );
})

app.get('/fetch_graph', async function (req, res) {
        let centerTitle = req.query.title;
        let branches = +req.query.branches;
        let numHops = +req.query.hops;
        //genGraphJSON([centerTitle], branches, numHops, (json) => {
         //       res.send(JSON.stringify(json));
        //});
	let graph = await genGraphJSON([centerTitle], branches, numHops);
	res.send(JSON.stringify(graph));
})

app.get('/expand_graph', async function (req, res) {
  let centerTitle = req.query.title;
  let branches = +req.query.branches;
  let numHops = +req.query.hops;
  let expandTitle = req.query.expandtitle;

  let oldGraph = await genGraphJSON([centerTitle], branches, numHops);
  let newGraph = await genGraphJSON([expandTitle], branches, numHops);
  let combined = await joinGraphs(oldGraph, newGraph);
  res.send(JSON.stringify(combined));
})

app.get('/clear', function (req, res) {
})

//app.get('/', function (req, res) {
//  res.send('Welcome to Wikinetworks');
  //res.render('index', { title: 'Welcome to Wikinode', message: 'Wikinodes' });

/*
 * Root routing. Simply redirects to wikinetwork.htm.
 */
app.get('/', (req, res) => {
  res.redirect('/wikinetwork.htm');
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

/*
 * CSCIC 5828 - Spring 2018
 * Team 1
 *
 */

var express = require('express');
var app = express();
const WikiData = require('./wikiData');
const genGraphJSON = require('./createGraph');

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.use(express.static(__dirname + '/css'));

app.use(express.static(__dirname));

app.get('/wikinetwork.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "wikinetwork.htm" );
})

app.get('/process_get', function (req, res) {
        console.log("process test");
        let centerTitle = req.query.title;
        let branches = 3;
        let numHops = 3;
        genGraphJSON([centerTitle], branches, numHops, (json) => {
                res.send(JSON.stringify(json));
        });
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

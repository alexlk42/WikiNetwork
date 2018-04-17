/*
 * CSCIC 5828 - Spring 2018
 * Team 1
 *
 */

var express = require('express');
var app = express();
const WikiData = require('./wikiData');

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.use(express.static(__dirname + '/css'));

app.use(express.static(__dirname));

app.get('/wikinetwork.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "wikinetwork.htm" );
})

app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.get('/clear', function (req, res) {

})

//app.get('/', function (req, res) {
//  res.send('Welcome to Wikinetworks');
  //res.render('index', { title: 'Welcome to Wikinode', message: 'Wikinodes' });

// Setup simple routing
app.get('/', (req, res) => {
  WikiData.getURL('Computer_science').then(result => res.send(result));
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

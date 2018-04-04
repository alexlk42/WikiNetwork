/*
 * CSCIC 5828 - Spring 2018
 * Team 1
 *
 * References
 * 1. https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-1-d67367ac5171
 * 2. https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
 * 3. https://www.hacksparrow.com/form-handling-processing-in-express-js.html
 */

// Import required packages
const express = require('express');
const app = express();
const WikiData = require('./wikiData');

// Setup simple routing
app.get('/', (req, res) => {
  //WikiData.getForwardLinks('Computer_science', 10, result => res.send(JSON.stringify(result)));
  WikiData.getDescription('Computer_science', result => res.send(JSON.stringify(result)));
});

// Listen on port
let port = 3000;
app.listen(port, () => console.log(`Server using port ${port}`));

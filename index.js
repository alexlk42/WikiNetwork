/*
 * CSCIC 5828 - Spring 2018
 * Homework 4
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

// Header info
const header = `CSCI 5828<br>Homework 4<br>Team 1<br>Simple Form`;

// The HTML for our simple form
const form = function(data) {
        data = (!data) ? '' : data;
        return`<form action="/" method="get">
                <label for="data">Your Name: </label>
                <input id="data" name="data" type="text" value="${data}">
                <input type="submit" value="Send Name">
                </form>`;
}


// Setup simple routing
app.get('/', (req, res) => {
        if (req.query.data) {
                res.send(`${header}
                        <br><br>
                        Welcome, ${req.query.data}!!!
                        <br><br> ${form(req.query.data)}`);
        } else {
                res.send(`${header}
                        <br><br>
                        ${form(req.query.data)}`);
        }
});

// Listen on port
let port = 3000;
app.listen(port, () => console.log(`Server using port ${port}`));

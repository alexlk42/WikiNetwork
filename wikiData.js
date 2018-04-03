/*
 * This module serves as our interface to Wikipedia. This module exports
 * The WikiData class, which is full of static methods that get needed
 * data from Wikipedia.
 *
 * Reference:
 * 1. https://codeburst.io/4-ways-for-making-http-s-requests-with-node-js-c524f999942d
 */
 'user strict';

// Imports the https module, which we use to fetch data from the Wiki API
const https = require('https');

// The base URL to the Wiki API
const API_URL = 'https://en.wikipedia.org/w/api.php?';

// The GET param needed to make a call to the query function in the API
const API_QUERY_CALL = API_URL + 'action=query';

/*
 * A helper function that makes a call to the Wiki API.
 *
 * This function is private to this module!
 */
const callAPI = function(url, callback) {

  // Do an https GET to the given URL.
  https.get(url, function(res) {
    res.setEncoding('utf8');
    let result = '';
    res.on('data', function(data) {
      result += data;
    });
    res.on('end', function() {

      // Call the given callback and provide result
      callback(JSON.parse(result));
    });
  });
};

/*
 * The actual WikiData class. All methods are static because they don't
 * need any state from an instance.
 */
class WikiData {

  /*
   * A simple test call.
   */
  static testCall(callback) {
    const API_CALL = 'https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&formatversion=2';
    callAPI(API_CALL, callback);
  }
}

// Export the WikiData class.
module.exports = WikiData;

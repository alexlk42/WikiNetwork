/*
 * This module serves as our interface to the MediaWiki API. This module exports
 * The WikiData class, which is full of static methods that get needed
 * data from via MediaWiki API
 *
 * Reference:
 * 1. https://codeburst.io/4-ways-for-making-http-s-requests-with-node-js-c524f999942d
 * 2. https://en.wikipedia.org/w/api.php
 */
'use strict';

// Imports the https module, which we use to fetch data from the MediaWiki API
const https = require('https');

// The base URL to the Wiki API
const API_URL = 'https://en.wikipedia.org/w/api.php';

// The MediaWiki API action we want to invoke.
const ACTION = 'query';

// The format of the output.
const FORMAT = 'json';

// The version of the output format. See https://www.mediawiki.org/wiki/API:JSON_version_2
const FORMAT_VERSION = '2';

// The delimiter the ouput/input uses.
const DEL = '|';

/*
 * The actual WikiData class. All methods are static because they don't
 * need any state from an instance and are utility methods.
 */
class WikiData {

  /*
   * A helper function that creates the correct API url to do the wanted call.
   */
  static createURLString (prop, titles) {
    let tls = titles.join(DEL); // Join the titles
    return `${API_URL}?` +
          `action=${ACTION}` +
          `&titles=${tls}` +
          `&prop=${prop}` +
          `&format=${FORMAT}` +
          `&formatversion=${FORMAT_VERSION}`;
  }

  /*
   * A helper function that makes a call to the MediaWiki API. You may use
   * this method as a stand-alone. But, you should use the high-level get methods
   * in this class and try to only use this as a helper when possible.
   */
  static callAPI (url, callback) {
    if (!url) {
      console.error('URL is not valid! Not doing API call.');
      return;
    }

    if (!callback) {
      console.error('No callback! No point in doing API call.');
      return;
    }

    // Do an https GET to the given URL.
    https.get(url, function (res) {
      if (!res) {
        console.error('No response!');
        return;
      }

      // Set the output encoding
      res.setEncoding('utf8');

      // Collect result
      let result = '';
      res.on('data', function (data) {
        result += data;
      });

      // Once result is fully here, we can parse and do callback
      res.on('end', function () {
        callback(JSON.parse(result));
      });
    });
  }

  /*
   * Gets the forward links for the give page (specified by title). Will invoke
   * the given callback once results are ready. Passes the parsed JSON to the callback.
   *
   * titles: an array of strings where each string should be a title.
   * limit: the max number of links to return.
   * callback: the function to call once the results are in.
   */
  static getForwardLinks (titles, limit, callback) {
    this.callAPI(this.createURLString('links', titles) + `&pllimit=${limit};`, callback);
  }
}

// Export the WikiData class.
module.exports = WikiData;

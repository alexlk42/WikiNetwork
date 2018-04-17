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
 * Helper that extracts the desired field as an array (array of field data)
 * from the JSON result object. The array in the page, named by prop, is an
 * array of objects who should have a field named field. Will return empty
 * array if the given result is not as expected.
 */
const makeResultArray = function (result, prop, field) {
  let finalResult = [];

  // Make sure the result is valid, and if so, then collect final result.
  if (result && result.query && result.query.pages && result.query.pages[0] &&
    result.query.pages[0][prop]) {

    // Iterate over each object and push its field of interest onto the final result.
    result.query.pages[0][prop].forEach(object => {
      if (object[field]) finalResult.push(object[field]);
    });
  }

  return finalResult;
};

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
   * the given callback once results are ready. Passes an array of links to the callback.
   *
   * If limit is less than one, no action will happen. If limit is greater than
   * 500, then it will be capped at 500 and called with 500.
   *
   * title: should be a title as a string.
   * limit: the max number of links to return.
   * callback: the function to call once the results are in.
   *
   * return: true if an API call was made, false otherwise.
   */
  static getForwardLinks (title, limit, callback) {
    if (limit > 0) {
      limit = (limit > 500) ? 500 : limit;
      this.callAPI(this.createURLString('links', [title]) + `&pllimit=${limit};`, result => {

        // Call the user's callback, given the links
        callback(makeResultArray(result, 'links', 'title'));
      });
      return true;
    }
    return false;
  }

  /*
   * Gets the categories for the give page (specified by title). Will invoke
   * the given callback once results are ready. Passes an array of categories to the callback.
   *
   * If limit is less than one, no action will happen. If limit is greater than
   * 50, then it will be capped at 50 and called with 50.
   *
   * title: should be a title as a string.
   * limit: the max number of categories to return.
   * callback: the function to call once the results are in.
   *
   * return: true if an API call was made, false otherwise.
   */
  static getCategories(title, limit, callback) {
    if (limit > 0) {
      limit = (limit > 50) ? 50 : limit;
      this.callAPI(this.createURLString('categories', [title]) + `&cllimit=${limit};`, result => {

        // Call the user's callback, given the categories
        callback(makeResultArray(result, 'categories', 'title'));
      });
      return true;
    }
    return false;
  }

  /*
   * Gets the description for the given page by title.
   * Passes a string of the description to the callback.
   *
   * title: should be a title as a string.
   * callback: the function to call once the results are in.
   *
   * return: true if an API call was made, false otherwise.
   */
  static getDescription (title, callback) {
    this.callAPI(this.createURLString('description', [title]), result => {

      // Call the user's callback, given the description
      callback(result.query.pages[0].description);
    });
    return true;
  }

  /*
   * Gets the URL for the given page by title. Passes a string of the URL to the
   * callback.
   *
   * title: should be a title as a string.
   * callback: the function to call once the results are in.
   *
   * return: true if an API call was made, false otherwise.
   */
  static getURL (title, callback) {
    this.callAPI(this.createURLString('info', [title]) + '&inprop=url', result => {

      // Call the user's callback, given the URL.
      callback(result.query.pages[0].fullurl);
    });
    return true;
  }
}

// Export the WikiData class.
module.exports = WikiData;

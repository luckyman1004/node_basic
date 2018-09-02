/**
 * Helpers for various task
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all the Helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof(str) == 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(buffer) {
  try {
    const bufferObject = JSON.parse(buffer);
    return bufferObject;
  } catch (err) {
    return {};
  }
}

// Create a ctring of alpha numeric characters of a given length
helpers.createRandomString = function(strLength) {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

  if (strLength) {
    //  define all posible charactersfor the string creation
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // start the final string
    let str = '';
    for (i = 0; i < strLength; i++) {
      // get random char
      const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
      // Append characters
      str+=randomCharacter;
    }

    // return the string
    return str;

  } else {
    return false;
  }
}


module.exports = helpers;

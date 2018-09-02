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

module.exports = helpers;

/**
 * Helpers for various task
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const querystring = require('querystring');
const https = require('https');

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

// Send sms via Twilio
helpers.sendTwilioSMS = function (phone, msg, callback) {
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 11 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

  if (phone && msg) {
    // Configure the request payload to Twilio
    const payload ={
      From: config.twilio.fromPhone,
      To: `+234${phone}`,
      Body: msg
    }

    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.twilio.com',
      method: 'POST',
      path: `2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
      auth: `${config.twilio.accountSid} : ${config.twilio.authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    }

    // Instantiate the request object
    const req = https.request(requestDetails, function(res) {
      // console.log(res.statusCode, 'response for sms');
      // Grab the status of the sent request
      const status = res.statusCode;

      if (status === 200 || status === 201) {
        callback(false)
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    // console.log(req);

    // Bind to the error event so it does not get thrown
    req.on('error', function(err) {
      callback(err);
    })

    // Add the payload to the request
    req.write(stringPayload);

    // End the requust
    req.end();

  } else {
    callback('Given params missing or invalid');
  }
}

module.exports = helpers;

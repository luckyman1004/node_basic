/**
 * WOrker related task
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

const helpers = require('./helpers');
const _data = require('./data');
const _logs = require('./logs');

const util = require('util');
const debug = util.debuglog('workers');
// Instantiate the worker objects
const workers = {};

// Lookup all checks, get teir data, send to the validator.
workers.getAllChecks = function(){
  // get all the checks in the system
  _data.list('checks', function(err, checks) {
    if(!err && checks && checks.length > 0) {
      checks.forEach(function(check){
        _data.read('checks', check, function(err, originalCheckData) {
          if(!err && originalCheckData) {
            // Pass to the validator and continue function
            workers.validateCheckData(originalCheckData);
          } else {
            debug('Error reading check data');
          }
        })
      })
    } else {
      debug('Error:  could not find any checks to process');
    }
  })
}

// Sanity checks for the check data
workers.validateCheckData = function(originalCheckData){
  originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData!= null ? originalCheckData : {}
  originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.length == 20 ? originalCheckData.id : false
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.length == 11 ? originalCheckData.userPhone : false
  originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['https','http'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
  originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
  originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post','get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
  originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
  originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

  // Set the keys that may not be set if the owrkers have never see the checks before
  originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
  originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

  // If all te checks pass, pass the data along to the next step in the process.
  if (originalCheckData.id &&
      originalCheckData.userPhone &&
      originalCheckData.protocol &&
      originalCheckData.url &&
      originalCheckData.method &&
      originalCheckData.successCodes &&
      originalCheckData.timeoutSeconds)
  {
    workers.performCheck(originalCheckData);
  } else {
    debug('Error: One of the checks is not properly formatted. Skipped');
  }
}

// Performs the checks, send data and outcome to next step in the process
workers.performCheck = function(originalCheckData){
  // Prepare the initial check outcome
  const checkOutcome = {
    error: false,
    responseCode: false
  };

  // Mark that the outcome has not been sent yet
  let outcomeSent = false

  // Parse the hostname and path put of the original data
  const parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true)
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  // Construct the request
  const requestObject = {
    protocol: originalCheckData.protocol+':',
    hostname,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000
  };

  // Instantiate the request (using either https or http)
  const _moduleToUse = originalCheckData.protocol === 'http' ? http : https;
  const req = _moduleToUse.request(requestObject, function(res) {

    const status = res.statusCode;
    // debug(status)
    // Update the check outcome and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to the error event so it does not get thrown
  req.on('error', function(event) {
    // Update the check outcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: event
    };

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });


  // Bind to to the timeout event
  req.on('timeout', function(event) {
    // Update the check outcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: 'timeout'
    };

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // End the request
  req.end();
};

// Process the echk outcome, update the data and trigger an alert
// Logic for check that has never ben tested - no alert triggered in this case
workers.processCheckOutcome = function(originalCheckData, checkOutcome) {
  // Decide if the check is considered up or down
  const state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

  // Decide if an alert is warranted
  const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

  // Log the outcome
  const timeOfCheck = Date.now();
  workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

  // Update the check Data
  const newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // Save the updates
  _data.update('checks', newCheckData.id, newCheckData, function(err) {
    if(!err) {
      // Send the check to the next phase in the process if needed
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData);
      } else{
        debug('Outcome has not changed. No alert needed')
      }

    } else {
      debug('Error trying to save data to one check');
    }
  });
}

// Alert the user of the change of status
workers.alertUserToStatusChange = function(newCheckData) {
  const msg = 'Alert: Your check for '+newCheckData.method.toUpperCase()+' '+newCheckData.protocol+'://'+newCheckData.url+' is currently up';

  helpers.sendTwilioSMS(newCheckData.userPhone, msg, function(err) {
    if(!err) {
      debug('User was alert via SMS');
    } else {
      debug('Error: Could not send alert for state change to user');
    }
  });
}

workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
  // Form the lg Data
  const logData ={
    check: originalCheckData,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck
  };

  //  convert data to string
  const logString = JSON.stringify(logData);

  // Determine name of log file
  const logFileName = originalCheckData.id;

  // Append the log string to the file
  _logs.append(logFileName, logString, function(err) {
    if(!err) {
      debug('Logging to file succeeded');
    } else {
      debug('Logging to file failed');
    }
  });
}

//  Rotate/compress the log files
workers.rotateLogs = function () {
  // List all the (non-compressed) log files
  _logs.list(false, function(err, logs) {
    if(!err && logs && logs.length > 0) {
      logs.forEach(function(logName) {
        // Compress the sata to a different file
        const logId = logName.replace('.log', '');
        const newLogId = logId+'-'+Date.now();
        _logs.compress(logId, newLogId, function (err) {
          if (!err) {
            // Truncate the log
            _logs.truncate(logId, function(err) {
              if (!err) {
                debug('Success: File truncated');
              } else {
                debug('Error truncating log files');
              }
            });
          } else {
            debug('Error compressins one of the log files');
          }
        });
      })
    }else {
      debug('Error: Could not find any logs to rotate');
    }
  });
}

// Timer to execute the worker-process once per minute
workers.loop = function() {
  setInterval(function(){
    workers.getAllChecks();
  }, 1000 * 10);
};

// Timer to execute the log process once per immediately
workers.logRotationLoop = function () {
  setInterval(function(){
    workers.rotateLogs();
  }, 1000 * 60 * 60 * 24);
}


// Init script
workers.init = function() {
//
console.log('\x1b[32m%s\x1b[0m','Background workers running')

  // Execute all the checks
  workers.getAllChecks();

  // Call a loop so the checks continue to execute on their own
  workers.loop();

  // Compress all logs immediately
  workers.rotateLogs();

  // Call hte compression loop so logs will be compresses later
  workers.logRotationLoop();
}

module.exports = workers;

/**
 * Library for storing and rotating logs
 */

// Dependencies
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

// Container for the module
const lib = {};

// Base directory of the logs folder
lib.baseDir = path.join(__dirname, '/../.logs/')

// Append a string to a file. Create the file if the file does not exist.
lib.append = function (file, str, callback) {

  // Open the file for writing
  fs.open(lib.baseDir+file+'.log', 'a', function(err, fileDescriptor) {
    if(!err && fileDescriptor) {
      // Append to the file and close it
      fs.appendFile(fileDescriptor,str+'\n', function(err) {
        if(!err) {
          fs.close(fileDescriptor, function(err) {
            if(!err) {
              callback(false);
            } else {
              callback('Error closing file that was being appended');
            }
          })
        } else {
          callback('Error appending to file');
        }
      })
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
}

// List all the logs and include the compressed logs optionally
lib.list = function (includeCompressedLogs, callback) {
  fs.readdir(lib.baseDir, function (err, data) {
    if(!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach(function(fileName) {
        // Add the .log files
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }

        // Add the gzipped files optionally
        if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  })
}

// compress the contens of one .log file into a .gz.b64 file within the same directory.
lib.compress = function(logId, newLogId, callback) {
  const sourceFile = logId+'.log';
  const destFile = newLogId+'.gz.b64';

  // Read the source file
  fs.readFile(lib.baseDir+sourceFile, 'utf8', function (err, inputString) {
    if(!err && inputString) {
      //  Compress the data using gzip
      zlib.gzip(inputString, function(err, buffer) {
        if(!err && buffer) {
          // Send the data to the destination file.
          fs.open(lib.baseDir+destFile,'wx', function (err, fileDescriptor) {
            if(!err && fileDescriptor) {
              // Write to the destination file
              fs.writeFile(fileDescriptor, buffer.toString('base64'), function(err) {
                if(!err) {
                  fs.close(fileDescriptor, function(err) {
                    if(!err) {
                      callback(false);
                    } else {
                      callback(err);
                    }
                  })
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          })
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  })
}

// Decompress the contents of a .gz.b64 file into a sting variable
lib.decompress = function(fileId, callback) {
  const fileName = fileId+'.gz.b64';

  fs.readFile(lib.baseDir+fileName, 'ut8', function(err, str) {
    if (!err && str) {
      // Decompress the data
      const inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer, function(err, outputBuffer) {
        if(!err && outputBuffer) {
          // callback
          const string = outputBuffer.toString();
          callback(false, string);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  })
}

// Truncate a og file
lib.truncate = function(logId, callback) {
  fs.truncate(lib.baseDir+logId+'.log',0, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback(err)
    }
  })
}

// Export the module
module.exports = lib;

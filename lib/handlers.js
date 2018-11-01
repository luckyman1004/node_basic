/**
 * Request Handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

const util = require('util');
const debug = util.debuglog('handlers');

// Define handlers
const handlers = {};

/**
 * HTML Handlers
 *
 */

// Index Handlers
handlers.index = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Uptime Checker - Monitoring Made Simple',
      'head.description': 'We offer free and simple uptime Monitoring for http and https site of all kind. When your site goes down we will send you a text message',
      'body.class': 'index',
    }

    helpers.getTemplate('index', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Public Assets
handlers.public = function (data, callback) {
  // reject any method that is not a GET
  if (data.method === 'get') {
    // Get the file name being requested
    const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
    if(trimmedAssetName.length > 0) {
      // Read the assets data
      helpers.getStaticAsset(trimmedAssetName, function(err, data) {
        if(!err && data) {
          // Check mime-type/file-type and determine content type. Default to plain text
          let contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }

          // callback the data
          callback(200, data, contentType);

        } else {
          callback(500)
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

// favicon
handlers.favicon = function (data, callback) {
  // reject any method that is not a GET
  if (data.method === 'get') {
    // Read the favicon data
    helpers.getStaticAsset('favicon.ico', function(err, data) {
      if(!err && data) {
        callback(200, data, 'favicon');
      } else {
        callback(500)
      }
    });
  } else {
    callback(405);
  }
};

// Create a new Check
handlers.checksCreate = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Create a new check',
      'body.class': 'checksCreate',
    }

    helpers.getTemplate('checksCreate', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// List all existing checks
handlers.checksList = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Dashboard - View all checks',
      'body.class': 'checksList',
    }

    helpers.getTemplate('checksList', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit a check
handlers.checksEdit = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Edit check details',
      'body.class': 'checksEdit',
    }

    helpers.getTemplate('checksEdit', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create Account
handlers.accountCreate = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Create an Account',
      'head.description': 'Sign up is eay and only takes a few seconds',
      'body.class': 'accountCreate',
    }

    helpers.getTemplate('accountCreate', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit your account
handlers.accountEdit = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Account Settings',
      'body.class': 'accountEdit',
    }

    helpers.getTemplate('accountEdit', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Delete your account response page
handlers.accountDeleted = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Account Deleted',
      'head.description': 'Your account has been deleted',
      'body.class': 'accountDeleted',
    }

    helpers.getTemplate('accountDeleted', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create New Session
handlers.sessionCreate = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Login to your Account',
      'head.description': 'Please enter your phone number and password to access your account',
      'body.class': 'accountCreate',
    }

    helpers.getTemplate('sessionCreate', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Delete existing Session
handlers.sessionDeleted = function(data, callback) {
  // Reject any request that is not a GET
  if (data.method === 'get') {

    // Interpolation data
    const templateData = {
      'head.title': 'Logged Out',
      'head.description': 'You have been logged out of your account',
      'body.class': 'sessionDeleted',
    }

    helpers.getTemplate('sessionDeleted', templateData, function(err, str) {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if(!err && str) {
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

/**
 * JSON API Handlers
 *
 */

handlers.users = function(data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1 ){
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
}

// Container for the users submethods
handlers._users = {}

// Handlers - Users - Post
// Required field: Firstname, lastname, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
  // Check that all required fields are filled out
  const firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
  const lastname = typeof(data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if (firstname && lastname && phone && password && tosAgreement) {
    // Make sure the user does not already exist
    _data.read('users', phone, function(err, data) {
      if(err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          //  Create the user Object
          const newUser = {
            firstname,
            lastname,
            phone,
            hashedPassword,
            tosAgreement: true
          };

          // Store the user
          _data.create('users', phone, newUser, function(err) {
            if(!err) {
              callback(200);
            } else {
              callback(500, {'Error': 'Could not create the new user'});
            }
          });

        } else {
          callback(500, { 'Error': 'Could not hash the users password'});
        }

      } else {
        callback(400, { 'Error': 'User with that phone number already exist' });
      }
    });

  } else {
    callback(405, { 'Error': 'Missing required fields' });
  }
}

// Handlers - Users - Get
// Required data: Phone
// Optional: None
handlers._users.get = function(data, callback) {
  // Check phone is valid
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 11 ? data.queryStringObject.phone : false;
  if (phone) {

    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, function (validToken) {
      if (validToken) {
        _data.read('users', phone, function(err, data) {
          if(!err && data) {
            // Remove the hashed password before returning to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404, { 'Error': 'User does not exist' });
          }
        });
      } else {
        callback(403, { 'Error': 'Missing required token in header or token is invalid' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Handlers - Users - Update
// Required data: None
// Optional data: Firstname , lastname, phone, password (at least one option)
handlers._users.put = function(data, callback) {

// Check for required fields
  const firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
  const lastname = typeof(data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  //
  if (phone) {
    if (firstname || lastname || password) {

      const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      handlers._tokens.verifyToken(token, phone, function (validToken) {
        if (validToken) {

          // Look up user
          _data.read('users', phone, function(err, userData) {
            if(!err && data) {
              // Update the fields
              if(firstname) {
                userData.firstname = firstname;
              }
              if(lastname) {
                userData.lastname = lastname;
              }
              if(password) {
                userData.hashedPassword = helpers.hash(password);
              }

              // Store the new Update
              _data.update('users', phone, userData, function(err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {'Error': 'Could not update the user'});
                }
              })

            } else {
              callback(400, {'Error': 'The specified user does not exist'});
            }
          });
          // Get the token from the headers

        } else {
          callback(403, { 'Error': 'Missing required token in header or token is invalid' });
        }
      });
    } else {
      callback(400, {'Error': 'Missing fields to update'});
    }
  } else {
    callback(400, {'Error': 'Missing required field'});
  }
}

// Handlers - Users - Delete
// Required data: Phone
// Optional: None
// @TODO Delete other associate data files.
handlers._users.delete = function(data, callback) {

  // Check phone is valid
  // const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 11 ? data.queryStringObject.phone : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 11 ? data.payload.phone : false;

  if (phone) {

    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, function (validToken) {
      if (validToken) {
        // Lookup the user
        _data.read('users', phone, function(err, userData) {
          if(!err && userData) {
            _data.delete('users', phone, function(err) {
              if (!err) {
                // Delete user checks associate with user
                const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                const checksToDelete = userChecks.length;
                if (checksToDelete > 0) {
                  let checksDeleted = 0;
                  let deletionErrors = false;
                  // Loop through the checks
                  userChecks.forEach(function(checkId) {
                    _data.delete('checks', checkId, function(err) {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted === checksToDelete) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {'Error': 'Error encounter while deleting checks. Check may still exist'});
                        }
                      }
                    });
                  });
                }
              } else {
                callback(500, {'Error': 'Could not delete the user'});
              }
            })
          } else {
            callback(404, { 'Error': 'Could not find the user' })
          }
        })
      } else {
        callback(403, { 'Error': 'Missing required token in header or token is invalid' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Tokens
handlers.tokens = function(data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1 ){
    handlers._tokens[data.method](data, callback);
  } else {
    callbacl(405);
  }
}

// Container for all the tooken submethods
handlers._tokens = {}

// Tokens - Post
// Required data: phone , password
// Optional data: none
handlers._tokens.post = function(data, callback) {
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if (phone) {
    // Lookup the user who matches the phone number
    _data.read('users', phone, function(err, userData) {
      if(!err && userData) {
        // Hash the passwor and compare with userObject
        const hashedPassword = helpers.hash(password);

        if (hashedPassword == userData.hashedPassword) {
          // if valid, create token for request. Set exp date to 1hr
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone: phone,
            id: tokenId,
            expires: expires,
          }

          _data.create('tokens', tokenId, tokenObject, function(err) {
            if(!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {'Error':  'Could not create token'});
            }
          });

        } else {
          callback(400, {'Error':  'Password did not match'});
        }
      } else {
        callback(400, {'Error':  'Could not find the user'});
      }
    });
  } else {
    callback(400, {'Error':  'Missing required fields'});
  }

}

// Tokens - Get
// Required data: identifier
// Optional data: none
handlers._tokens.get = function(data, callback) {
  // Check phone is valid
  const tokenId = typeof(data.queryStringObject.tokenId) == 'string' && data.queryStringObject.tokenId.length == 20 ? data.queryStringObject.tokenId : false;
  if (tokenId) {
    _data.read('tokens', tokenId, function(err, tokenData) {
      if(!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, { 'Error': 'Token does not exist' })
      }
    })
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Tokens - Update
// Required data: identifier, extend
// Optional data: none
handlers._tokens.put = function(data, callback) {
  const tokenId = typeof(data.payload.tokenId) == 'string' && data.payload.tokenId.trim().length == 20 ? data.payload.tokenId.trim() : false;
  const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

  if (tokenId && extend) {
    // Lookup the token
    _data.read('tokens', tokenId, function(err, tokenData) {
      if(!err && tokenData) {
        // Check token expiry
        if (tokenData.expires > Date.now()) {
          // Reset the expiration by one hr
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update('tokens', tokenId, tokenData, function(err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {'Error': 'Could not update the expiration date'});
            }
          })
        } else {
          callback(400, { 'Error': 'Token has already expired and cannot be extened' })
        }
      } else {
        callback(404, { 'Error': 'Token does not exist' })
      }
    })
  } else {
    callback(404, { 'Error': 'Missing required field or fields are invalid' })
  }
}

// Tokens - Delete
// Required data: identifiers
// Optional data: none
handlers._tokens.delete = function(data, callback) {
  // Check phone is valid
  const tokenId = typeof(data.queryStringObject.tokenId) == 'string' && data.queryStringObject.tokenId.length == 20 ? data.queryStringObject.tokenId : false;
  if (tokenId) {
    // Lookup the user
    _data.read('tokens', tokenId, function(err, tokenData) {
      if(!err && tokenData) {
        _data.delete('tokens', tokenId, function(err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {'Error': 'Could not delete the token'});
          }
        });
      } else {
        callback(404, { 'Error': 'Could not find the token' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Vevrify User Token
handlers._tokens.verifyToken = function (tokenId, phone, callback) {
  _data.read('tokens', tokenId, function(err, tokenData) {
    if(!err && tokenData) {
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else{
        callback(false);
      }
    } else {
      callback(false);
    }
  });
}

// Checks
handlers.checks = function(data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1 ){
    handlers._checks[data.method](data, callback);
  } else {
    callbacl(405);
  }
}

// Container for all the checks submethods
handlers._checks = {}

// Handlers - Checks - Post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional: none
// @TODO
handlers._checks.post = function(data, callback) {
  // Validate inputs
  const protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  const url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  const method = typeof(data.payload.method) == 'string' && ['post','get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  const successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Lookup the user by reading the token
    _data.read('tokens', token, function(err, tokenData) {
      if(!err && tokenData) {
        const userPhone = tokenData.phone;

        // Look up the user data
        _data.read('users', userPhone, function(err, userData) {
          if(!err && userData) {
            const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
            // verifty the user has the number of max checks per users
            if (userChecks.length < config.maxChecks) {
              const checkId = helpers.createRandomString(20);
              // Create the check object and include the users phone
              const checkObject = {
                id: checkId,
                userPhone,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds,
              }

              // Save the objects
              _data.create('checks', checkId, checkObject, function(err) {
                if(!err) {
                  // Add the checkid to the users object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);

                  // Save the new user data
                  _data.update('users', userPhone, userData, function(err) {
                    if(!err) {
                      // Return the data about ht enew check
                      callback(200, checkObject);
                    } else {
                      callback(500, {'Error': 'Could not update the user with the new check'});
                    }
                  })
                } else {
                  callback(500, {'Error': 'Could not create the new check'});
                }
              });
            } else {
              callback(400, {'Error': 'User already has the max num of checks ('+config.maxChecks+')' });
            }
          } else {
            callback(403, { 'Error': 'Forbbideen again' });
          }
        });
      } else {
        callback(403, { 'Error': 'Forbbideen' })
      }
    })
  } else {
    callback(400, {'Error': 'Missing required inputs or inputs are invalid'})
  }

}

// Handlers - Checks - Get
// Required data: checkId
// Optional:
// @TODO
handlers._checks.get = function(data, callback) {
  // Check check id is valid
  const checkId = typeof(data.queryStringObject.checkId) == 'string' && data.queryStringObject.checkId.length == 20 ? data.queryStringObject.checkId : false;
  if (checkId) {
    // Lookup the check
    _data.read('checks', checkId, function(err, checkData) {
      if(!err && checkData) {
        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify token is valid and belongs to the user who created the checks
        handlers._tokens.verifyToken(token, checkData.userPhone, function (validToken) {
          if (validToken) {
            // Return the check Data
            callback(200, checkData)
          } else {
            callback(403);
          }
        });
      } else {
        callback(404, { 'Error': 'User does not exist' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }
}

// Handlers - Checks - Update
// Required data: checkId
// Optional: protocol, url, method, successCodes, timeoutSeconds (at least one must be provided)
handlers._checks.put = function(data, callback) {
  // Validations - Required
  const checkId = typeof(data.payload.checkId) == 'string' && data.payload.checkId.trim().length == 20 ? data.payload.checkId : false;

  // validations - Optional
  const protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  const url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  const method = typeof(data.payload.method) == 'string' && ['post','get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  const successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  if (checkId) {
    // check if ther are optional fields
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup the check
      _data.read('checks', checkId, function(err, checkData) {
        if(!err && checkData) {
          // Get the token from the headers
          const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
          // Verify token is valid and belongs to the user who created the checks
          handlers._tokens.verifyToken(token, checkData.userPhone, function (validToken) {
            if (validToken) {
              // Update the checks where necesary
              if(protocol) {
                checkData.protocol = protocol;
              }
              if(url) {
                checkData.url = url;
              }
              if(method) {
                checkData.method = method;
              }
              if(successCodes) {
                checkData.successCodes = successCodes;
              }
              if(timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds;
              }

              // Store the new updates
              _data.update('checks', checkId, checkData, function(err) {
                if(!err) {
                  callback(200);
                } else {
                  callback(500, {'Error': 'Could not update the checks'});
                }
              })
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, { 'Error': 'Check ID does not exist' });
        }
      })
    } else {
      callback(400, { 'Error': 'Missing fields to update' });
    }
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }

}

// Handlers - Checks - Delete
// Required data:
// Optional:
// @TODO
handlers._checks.delete = function(data, callback) {
  // Check phone is valid
  const checkId = typeof(data.queryStringObject.checkId) == 'string' && data.queryStringObject.checkId.length == 20 ? data.queryStringObject.checkId : false;
  if (checkId) {

    _data.read('checks', checkId, function(err, checkData) {

      if(!err && checkData) {
        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify token is valid and belongs to the user who created the checks
        handlers._tokens.verifyToken(token, checkData.userPhone, function (validToken) {
          if (validToken) {

            // delete the check data
            _data.delete('checks', checkId, function(err) {
              if (!err) {
                // Lookup the user
                _data.read('users', checkData.userPhone, function(err, userData) {
                  if(!err && userData) {

                    const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                    // Remove the deleted checks from their list of checks
                    const checkPosition = userChecks.indexOf(checkId);

                    if(checkPosition > -1) {
                      // Remove check using splice
                      userChecks.splice(checkPosition, 1);
                      // Re-save the user's data
                      _data.update('users', checkData.userPhone, userData, function(err) {
                        if (!err) {
                          callback(200);
                        } else {
                          callback(500, {'Error': 'Could not update the user'});
                        }
                      })

                    } else {
                      callback(500, {'Error': 'Could not find the check on the users object'});
                    }
                  } else {
                    callback(404, { 'Error': 'Could not find the user' })
                  }
                })
              } else {
                callback(500, {'Error': 'Could not delete the check data'});
              }
            })
          } else {
            callback(403, { 'Error': 'Missing required token in header or token is invalid' });
          }
        });
      } else {
        callback(400, { 'Error': 'Check ID does not exist' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' });
  }
}

// Ping handler
handlers.ping = function (data, callback){
  callback(200);
}

//  Not found handlers
handlers.notFound = function(data, callback) {
  callback(404);
}

module.exports = handlers;

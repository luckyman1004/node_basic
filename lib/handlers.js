/**
 * [handlers description]
 * @type {Object}
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define handlers
const handlers = {};

handlers.users = function(data, callback) {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1 ){
    handlers._users[data.method](data, callback);
  } else {
    callbacl(405);
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
            firstname: firstname,
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
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 11 ? data.queryStringObject.phone : false;
  if (phone) {

    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, function (validToken) {
      if (validToken) {
        // Lookup the user
        _data.read('users', phone, function(err, data) {
          if(!err && data) {
            _data.delete('users', phone, function(err) {
              if (!err) {
                callback(200);
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

// Ping handler
handlers.ping = function (data, callback){
  callback(200);
}

//  Not found handlers
handlers.notFound = function(data, callback) {
  callback(404);
}

module.exports = handlers;

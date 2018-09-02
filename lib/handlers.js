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
  console.log(data);
  const firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
  const lastname = typeof(data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  console.log(firstname);
  console.log(lastname);
  console.log(phone);
  console.log(password);
  console.log(tosAgreement);

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
    })

  } else {
    callback(405, { 'Error': 'Missing required fields' });
  }
}

// Handlers - Users - Get
handlers._users.get = function(data, callback) {

}
// Handlers - Users - Update
handlers._users.put = function(data, callback) {

}
// Handlers - Users - Delete
handlers._users.delete = function(data, callback) {

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

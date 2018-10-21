
/*
 * Frontend Logic for application
 *
 */

// Container for the frontend application
 var app = {};

// Config
app.config = {
  sessionToken: false,
};

// Ajax client for the restful API
app.client = {};


// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
  headers = typeof(headers) == 'object' && headers !== null ? headers :  {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject :  {};
  payload = typeof(payload) == 'object' && payload !== null ? payload :  {};
  callback = typeof(callback) == 'function' ? callback : false;

  // Foe each querystring param sent, add it to the path

  const requestUrl = path+'?';

  let counter = 0;

  for (const queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter=+1;
      // If one query string param has already been added, prepned new one with an '&'
      if (counter > 1) {
        requestUrl+='&';
      }

      // Add the key and value
      requestUrl+=queryKey+'='+queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  const xhr = new XMLHttpRequest()
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader('Contrnt-Type', 'application/json');

  // For each header send. add it to the request
  for (const headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  // If ther is a current session token set, add that as a header
  if (app.config.sessionToken) {
    xhr.setRequestHeader('token', app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const statusCode = xhr.status;
      const responseReturned = xhr.responseText;

      // callback if requested;
      if (callback) {
        try {
          const parsedResponse = JSON.parse(responseReturned);
          callback(statusCode, responseReturned);
        } catch (e) {
          callback(statusCode, false);
        }
      }
    }
  };

  // Send the payload as JSON
  const payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};

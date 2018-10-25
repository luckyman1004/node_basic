
/*
 * Frontend Logic for application
 *
 */

// Container for the frontend application
 const app = {};

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

  // For each querystring param sent, add it to the path
  let requestUrl = path+'?';

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
  xhr.setRequestHeader('Content-Type', 'application/json');

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

// / Bind the logout button
app.bindLogoutButton = function(){
  document.getElementById("logoutButton").addEventListener("click", function(e){
    // Stop it from redirecting anywhere
    e.preventDefault();

    // Log the user out
    app.logUserOut();

  });
};

// Log the user out then redirect them
app.logUserOut = function(){
  // Get the current token id
  const tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  // Send the current token to the tokens endpoint to delete it
  const queryStringObject = {
    'tokenId' : tokenId
  };
  app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    // Set the app.config token as false
    app.setSessionToken(false);

    // Send the user to the logged out page
    window.location = '/session/deleted';

  });
};



// Bind the forms
app.bindForms = function(){
  const forms = document.querySelectorAll("form");

  let editForm;

  if(forms && forms.length > 0) {
    for (let i = 0; i < forms.length; i++) {
      editForm = forms[i];

      editForm.addEventListener("submit", function(e){
        e.preventDefault();

        // Stop it from submitting
        let method;
        const update = document.querySelector("#accountEdit1 .method");

        if(update) {
          method = update.value.toUpperCase()
        } else {
          method = this.method.toUpperCase();
        }

        const formId = this.id;
        const path = this.action;

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'hidden';

        // Turn the inputs into a payload
        const payload = {};
        const elements = this.elements;
        for(let i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            const valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
            payload[elements[i].name] = valueOfElement;
          }
        }

        // Call the API
        app.client.request(undefined,path,method,undefined,payload,function(statusCode,responsePayload){

          console.log(method);
          // Display an error on the form if needed
          if(statusCode !== 200){

            if(statusCode == 403){
              // log the user out
              app.logUserOut();

            } else {

              // Try to get the error from the api, or set a default error message
              const error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // Set the formError field to an empty string
            document.querySelector("#"+formId+" .formError").innerHTML = '';

            // Hide the form error field on the form
            document.querySelector("#"+formId+" .formError").style.display = 'hidden';

            // If successful, send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }
        });
      });
    }
  } else {
    console.log('none');
  }
  // if(document.querySelector("form")){
  //   document.querySelector("form").addEventListener("submit", function(e){
  //
  //     e.preventDefault();
  //
  //     // Stop it from submitting
  //     let method;
  //     const update = document.querySelector("#accountEdit1 .method");
  //     // const update2 = document.querySelector("#accountEdit2 .method").value;
  //
  //     if(update) {
  //       method = update.value.toUpperCase()
  //     } else {
  //       method = this.method.toUpperCase();
  //     }
  //
  //     const formId = this.id;
  //     const path = this.action;
  //
  //     // Hide the error message (if it's currently shown due to a previous error)
  //     document.querySelector("#"+formId+" .formError").style.display = 'hidden';
  //
  //     // Turn the inputs into a payload
  //     const payload = {};
  //     const elements = this.elements;
  //     for(let i = 0; i < elements.length; i++){
  //       if(elements[i].type !== 'submit'){
  //         const valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
  //         payload[elements[i].name] = valueOfElement;
  //       }
  //     }
  //
  //     // Call the API
  //     app.client.request(undefined,path,method,undefined,payload,function(statusCode,responsePayload){
  //
  //       console.log(method);
  //       // Display an error on the form if needed
  //       if(statusCode !== 200){
  //
  //         if(statusCode == 403){
  //           // log the user out
  //           app.logUserOut();
  //
  //         } else {
  //
  //           // Try to get the error from the api, or set a default error message
  //           const error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';
  //
  //           // Set the formError field with the error text
  //           document.querySelector("#"+formId+" .formError").innerHTML = error;
  //
  //           // Show (unhide) the form error field on the form
  //           document.querySelector("#"+formId+" .formError").style.display = 'block';
  //         }
  //       } else {
  //         // Set the formError field to an empty string
  //         document.querySelector("#"+formId+" .formError").innerHTML = '';
  //
  //         // Hide the form error field on the form
  //         document.querySelector("#"+formId+" .formError").style.display = 'hidden';
  //
  //         // If successful, send to form response processor
  //         app.formResponseProcessor(formId,payload,responsePayload);
  //       }
  //     });
  //   });
  // }
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  const functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
    // Take the phone and password, and use it to log the user in
    const newPayload = {
      'phone' : requestPayload.phone,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/checks/all';
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/checks/all';
  }

    // If forms saved successfully and they have success messages, show them
  const formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  const tokenString = localStorage.getItem('usertoken');
  if(typeof(tokenString) == 'string'){
    try{
      const token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  const target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = JSON.parse(token);
  // const tokenString = JSON.stringify(token);
  localStorage.setItem('usertoken',token);
  if(typeof(token) == 'string'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Renew the token
app.renewToken = function(callback){

  const currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    const payload = {
      'tokenId' : currentToken.id,
      'extend' : true,
    };

    app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        const queryStringObject = {'tokenId' : currentToken.id};
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
app.loadDataOnPage = function(){
  // Get the current page from the body class
  const bodyClasses = document.querySelector("body").classList;
  const primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for account settings page
  if(primaryClass == 'accountEdit'){
    app.loadAccountEditPage();
  }
};

// Load the account edit page specifically
app.loadAccountEditPage = function(){
  // Get the phone number from the current token, or log the user out if none is there
  const phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  if(phone){
    // Fetch the user data
    const queryStringObject = {
      'phone' : phone
    };
    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        responsePayload = JSON.parse(responsePayload);
        // Put the data into the forms as values where needed
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstname;
        document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastname;
        document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;

        // Put the hidden phone field into both forms
        const hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
        for(let i = 0; i < hiddenPhoneInputs.length; i++){
            hiddenPhoneInputs[i].value = responsePayload.phone;
        }

      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      } else {
        console.log(err);
      }
    });
  },1000 * 60);
};

// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();

};

// Call the init processes after the window loads
window.onload = function(){
  app.init();
};

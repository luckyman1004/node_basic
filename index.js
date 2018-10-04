/**
 * Primary file for API
 */

// Dependencies

const server = require('./lib/server.js');
const workers = require('./lib/workers.js');

const app = {};

app.init = function () {
  // start the server
  server.init();

  // start the workers
  workers.init();
};

//  Execute the application
app.init();


module.exports = app;

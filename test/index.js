/**
 * Test runner
 */

// Dependencies

const helpers = require('./../lib/helpers');
const assert = require('assert');

// Application logic for the test runner

 _app = {};

 // Container for the tests
_app.tests = {
  'unit': {}
};

// Assert that the getNumber function is returning a number
_app.tests.unit['helpers.getNumber should return a number'] = function(done) {
  const value = helpers.getNumber();
  assert.equal(typeof(value), 'number');
  done();
};

// Assert that the getNumber function is returning 1
_app.tests.unit['helpers.getNumber should return 1'] = function(done) {
  const value = helpers.getNumber();
  assert.equal(value, 1);
  done();
};

// Assert that the getNumber function should return 1
_app.tests.unit['helpers.getNumber should not return 2'] = function(done) {
  const value = helpers.getNumber();
  assert.notEqual(value, 2);
  done();
};

// Assert that the getNumber function should return 1
_app.tests.unit['helpers.getNumber should not return 1 again'] = function(done) {
  const value = helpers.getNumber();
  assert.equal(value, 2);
  done();
};

_app.countTests = function () {
  let counter = 0;

  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter+=1
        }
      }
    }
  }
  console.log(counter, 'counter');
  return counter;
}

// Run tests and collect errors and successes
_app.runTests = function() {
  let errors = [];
  let successes = 0;

  const limit = _app.countTests();
  let counter = 1;

  for (key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for(const testName in subTests){
        if (subTests.hasOwnProperty(testName)) {
          (function() {
            const tmpTestName = testName;
            const testValue = subTests[testName];
            // Call the runTests
            try {

              testValue(function() {
                // If it callback wihtout throwing, then it succeeding, log in green
                console.log('\x1b[32m%s\x1b[0m', tmpTestName);

                counter+=1;
                successes+=1;
                if(counter === limit) {
                  console.log('yes');
                  _app.produceTestReport(limit, successes, errors);
                }


              })
            } catch (e) {
              // If it throws , then it failed, so capture the error thrown and log it in red
              errors.push({
                name: testName,
                error: e
              });

              console.log('\x1b[31m%s\x1b[0m', tmpTestName);
              counter=+1;

              if(counter === limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
}

// Product a test outcome report
_app.produceTestReport = function(limit,successes,errors){
  console.log("");
  console.log("--------BEGIN TEST REPORT--------");
  console.log("");
  console.log("Total Tests: ",limit);
  console.log("Pass: ",successes);
  console.log("Fail: ",errors.length);
  console.log("");

  // If there are errors, print them in detail
  if(errors.length > 0){
    console.log("--------BEGIN ERROR DETAILS--------");
    console.log("");
    errors.forEach(function(testError){
      console.log('\x1b[31m%s\x1b[0m',testError.name);
      console.log(testError.error);
      console.log("");
    });
    console.log("");
    console.log("--------END ERROR DETAILS--------");
  }


  console.log("");
  console.log("--------END TEST REPORT--------");

};


// Run tests
_app.runTests();

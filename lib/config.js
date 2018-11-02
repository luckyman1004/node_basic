/**
 * Create environemnt configuration
 */

// Container for all the environments
const environments = {};

const productionPort = process.env.PORT || 4000;
const secureProductionPort = process.env.PORT || 4001

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  name: 'staging',
  hashingSecret: 'noname',
  maxChecks: 5,
  twilio: {
    'accountSid' : 'ACac511f5c7522fc057037f9e8783b26ca',
    'authToken' : 'f47425abcbc26892e780da7b454180a1',
    'fromPhone' : '+15005550006'
  },
  templateGlobals : {
    appName: 'Uptime Checker',
    companyName: 'Moes Chop Shop',
    yearCreated: '2018',
    baseUrl: 'http://localhost:3000'
  }
};

// Production environment
environments.production = {
  httpPort: productionPort,
  httpsPort: secureProductionPort,
  name: 'prod',
  hashingSecret: 'nonameinproduction',
  maxChecks: 10,
  twilio: {
    'accountSid' : 'ACac511f5c7522fc057037f9e8783b26ca',
    'authToken' : 'f47425abcbc26892e780da7b454180a1',
    'fromPhone' : '+15005550006'
  },
  templateGlobals : {
    appName: 'Uptime Checker',
    companyName: 'Moes Chop Shop',
    yearCreated: '2018',
    baseUrl: 'https://node-basics.herokuapp.com/'
  }
};

// Determine which environemnt is passed as a CLI argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check environment exist in out specified environments, else default to staging
const envExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// Export the environemnt
module.exports = envExport;

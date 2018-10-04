/**
 * Create environemnt configuration
 */

// Container for all the environments
const environments = {};

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
  }
};

// Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  name: 'prod',
  hashingSecret: 'nonameinproduction',
  maxChecks: 5
};

// Determine which environemnt is passed as a CLI argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check environment exist in out specified environments, else default to staging
const envExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// Export the environemnt
module.exports = envExport;

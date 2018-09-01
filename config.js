/**
 * Create environemnt configuration
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
  port: 3000,
  name: 'staging'
};

// Production environment
environments.production = {
  port: 5000,
  name: 'prod'
};

// Determine which environemnt is passed as a CLI argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check environment exist in out specified environments, else default to staging
const envExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// Export the environemnt
module.exports = envExport;

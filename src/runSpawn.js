const createLogger = require('progress-estimator');

// Create estimations logger
const logger = createLogger();

// Installation cycles
const runSpawn = (installStep) => new Promise((resolve, reject) => {
  // Spawn function
  const fn = new Promise((loggerResolve) => installStep.fn((err) => {
    if (err) {
      reject(err);
      throw new Error(err);
    }

    loggerResolve();
  }));

  const loggerOptions = {
    estimate: installStep.time,
  };

  // Run
  logger(fn, installStep.message, loggerOptions).then(resolve);
});

module.exports = runSpawn;

const { exec } = require('child_process');
const createLogger = require('progress-estimator');
const { commands } = require('./commands');

// Create estimations logger
const logger = createLogger();

// Installation cycles
const install = () => new Promise((resolve, reject) => {
  let step = 0;

  const run = async () => {
    const installStep = commands[step];

    // Install step executable
    const fn = new Promise((loggerResolve) => exec(
      installStep.cmd,
      installStep.execOptions,
      async (err) => {
        if (err) {
          reject(err);
          throw new Error(err);
        }

        try {
          if (typeof installStep.fn === 'function') {
            await installStep.fn();
          }
        } catch(err) {
          reject(err);
          throw new Error(err);
        }

        loggerResolve();
      },
    ));

    const loggerOptions = {
      id: step.toString(),
      estimate: installStep.time,
    };

    // Run
    await logger(fn, installStep.message, loggerOptions);

    // Run next step or resolve
    if (step++ < commands.length - 1) {
      run();
    } else {
      resolve();
    }
  };

  run();
});

module.exports = install;

const { exec } = require('child_process');
const createLogger = require('progress-estimator');
const generateCommands = require('./commands');

// Create estimations logger
const logger = createLogger();

// Generate the commands to run a succesful installation
const commands = generateCommands();

// Installation cycles
const install = () => new Promise((resolve, reject) => {
  let step = 0;

  const run = async () => {
    const installStep = commands[step];

    await logger(
      new Promise((loggerResolve) => exec(installStep.cmd, (err) => {
        if (err) return reject(err);

        if (typeof installStep.fn === 'function') {
          installStep.fn();
        }

        loggerResolve();
      })),
      installStep.message || '',
      {
        id: step.toString(),
        estimate: installStep.time || 0,
      },
    );

    if (step++ < commands.length - 1) {
      run();
    } else {
      resolve();
    }
  };

  run();
});

module.exports = install;

const createLogger = require('progress-estimator');
const { spawnCommands } = require('./commands');
const program = require('./program');

// Create estimations logger
const logger = createLogger();

// Installation cycles
const runSpawns = () => new Promise((resolve, reject) => {
  const commandsForType = spawnCommands[program.type];
  let step = 0;

  const run = async () => {
    const installStep = commandsForType[step];

    const fn = new Promise((loggerResolve) => installStep.fn((err) => {
      if (err) {
        reject(err);
        throw new Error(err);
      }

      loggerResolve();
    }));
    const options = {
      id: step.toString(),
      estimate: installStep.time,
    };

    // Run
    await logger(fn, installStep.message, options);

    if (step++ < commandsForType.length - 1) {
      run();
    } else {
      resolve();
    }
  };

  run();
});

module.exports = runSpawns;

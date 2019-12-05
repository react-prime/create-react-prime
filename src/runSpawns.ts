import createProgress from 'progress-estimator';
import { spawnCommands } from './commands';
import program from './program';

// @ts-ignore
const progress = createProgress();

// Installation cycles
const runSpawns = () => new Promise((resolve, reject) => {
  const commandsForType = spawnCommands[program.type];
  let step = 0;

  // No commands for this install type
  if (!commandsForType) {
    resolve();
  }

  const run = async () => {
    const installStep = commandsForType[step];

    // Spawn function
    const fn = new Promise((loggerResolve) => installStep.fn(loggerResolve));

    const loggerOptions = {
      id: step.toString(),
      estimate: installStep.time,
    };

    // Run
    await progress(fn, installStep.message, loggerOptions);

    // Run next step or resolve
    if (step++ < commandsForType.length - 1) {
      run();
    } else {
      resolve();
    }
  };

  run();
});

export default runSpawns;

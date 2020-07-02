import { exec } from 'child_process';
import createProgress from 'progress-estimator';
import { commands } from './commands';

// @ts-ignore
const progress = createProgress();

// Installation cycles
const install = () => new Promise((resolve, reject) => {
  let step = 0;

  const run = async () => {
    const installStep = commands[step];

    // Install step executable
    const fn = new Promise((loggerResolve) => exec(
      installStep.cmd,
      (err) => {
        if (err) {
          reject(err);
          throw new Error(err.message);
        }

        try {
          if (typeof installStep.fn === 'function') {
            installStep.fn();
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
    await progress(fn, installStep.message, loggerOptions);

    // Run next step or resolve
    if (step++ < commands.length - 1) {
      run();
    } else {
      resolve();
    }
  };

  run();
});

export default install;

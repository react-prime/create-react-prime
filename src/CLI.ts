import commander, { program } from 'commander';
import pkg from '../package.json';
import { TYPE, INSTALL_STEP } from './constants';

type Cache = {
  program?: commander.Command;
}

const cache: Cache = {
  program: undefined,
};

function prepareCLI(): commander.Command {
  // Return cached program for test
  if (cache.program) {
    return cache.program.parse(process.argv);
  }

  const installStepIdList = Object.keys(INSTALL_STEP).join(', ');

  // Set options
  program
    .option(
      '-t, --type <type>',
      `Install a type of react-prime. Options: ${Object.values(TYPE).join(', ')}`,
      TYPE.CLIENT,
    );

  program
    .option(
      '-d, --debug',
      'Show additional information when running the installer.',
    );

  program
    .option(
      '-s, --skipSteps <steps>',
      `Skip an install step. You can pass a comma separated list for multiple steps. Options: ${installStepIdList}`,
      // Map from comma separated string list to array
      (value) => {
        const allSteps = Object.keys(INSTALL_STEP);
        const skipSteps = value ? value.replace(' ', '').split(',') : [];
        const invalidSteps: string[] = [];

        // Check if any of the given steps is invalid
        for (const step of skipSteps) {
          const invalidStep = !allSteps.includes(step);

          if (invalidStep) {
            invalidSteps.push(step);
          }
        }

        if (invalidSteps.length > 0) {
          const stepsToStr = invalidSteps
            .map((str) => `'${str}'`)
            .join(', ');

          console.error(
            `Error in --skipSteps. ${stepsToStr} is/are invalid. Available steps: ${installStepIdList}`,
          );

          process.exit(1);
        }

        return skipSteps;
      },
    );

  // Set other variables
  program
    .version(pkg.version)
    .parse(process.argv);

  // Cache the program for test
  cache.program = program;

  return program;
}

export default prepareCLI;

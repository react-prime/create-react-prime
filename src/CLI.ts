import * as i from 'types';
import commander, { program } from 'commander';
import SERVICES from 'ioc/services';
import pkg from '../package.json';
import { TYPE, INSTALL_STEP } from './constants';

const installStepIdList = Object.keys(INSTALL_STEP).join(', ');

async function prepareCLI(): Promise<commander.Command> {
  // Cache program for test
  for (const opt in program.opts()) {
    if (opt === 'type') {
      return program.parse(process.argv);
    }
  }

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
      async (value) => {
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
          // Dynamic import to prevent circular dependency container > CLI > container
          const container = (await import('ioc')).default;
          const logger = container.get<i.LoggerType>(SERVICES.Logger);

          const stepsToStr = invalidSteps
            .map((str) => `'${str}'`)
            .join(', ');

          return logger.error(
            `Error in --skipSteps. ${stepsToStr} is/are invalid. Available steps: ${installStepIdList}`,
          );
        }

        return skipSteps;
      },
    );

  // Set other variables
  program
    .version(pkg.version)
    .parse(process.argv);

  return program;
}

export default prepareCLI;

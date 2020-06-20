import * as i from 'types';
import commander, { program } from 'commander';
import SERVICES from 'ioc/services';
import pkg from '../package.json';
import { TYPE, INSTALL_STEP } from './constants';

async function prepareCLI(): Promise<commander.Command> {
  // Indicate required argument input
  program
    .arguments('<projectName>')
    // Required for an error to show
    .action((name) => name);

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
      // eslint-disable-next-line max-len
      `Skip an install step. You can pass a comma separated list for multiple steps. Options: ${Object.keys(INSTALL_STEP).join(', ')}`,
      // Map from comma separated string list to array
      (value) => {
        const stepsStr = Object.keys(INSTALL_STEP);

        return value
          .replace(' ', '')
          .split(',')
          .map(async (id) => {
            if (!stepsStr.includes(id)) {
              // Dynamic import to prevent circular dependency ./ioc > CLI > ./ioc
              const container = (await import('./ioc/container')).default;
              const logger = container.get<i.LoggerType>(SERVICES.Logger);

              // eslint-disable-next-line max-len
              logger.error(`Error in --skipSteps. '${id}' is not a valid step. Available steps: ${Object.keys(INSTALL_STEP).join(', ')}`);
            }

            return id;
          });
      },
    );

  // Set other variables
  program
    .version(pkg.version)
    .parse(process.argv);

  return program;
}

export default prepareCLI;

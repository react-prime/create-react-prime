import { program } from 'commander';
import pkg from '../package.json';
import { TYPE } from './constants';
import INSTALL_STEP from './InstallStep/steps';

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
  )
  .option(
    '-d, --debug',
    'Show additional information when running the installer.',
  )
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
        .map((id) => {
          if (!stepsStr.includes(id)) {
            throw new Error(`'${id}' is not a valid step ID. See --help for available options.`);
          }

          return id;
        });
    },
  );

// Set other variables
program
  .version(pkg.version)
  .parse(process.argv);

export default program;

import { program } from 'commander';
import pkg from '../package.json';
import { TYPE } from './constants';

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

// Set other variables
program
  .version(pkg.version)
  .parse(process.argv);

export default program;

import program from 'commander';
import { TYPE } from './constants';
import pkg from '../package.json';

/*
  Program setup
*/

// Program options
program
  .option(
    '-t, --type <type>',
    `Install a type of react-prime. Options: ${Object.values(TYPE).join(', ')}`,
    TYPE.CLIENT,
  )
  .option(
    '--typescript',
    'Install a type of react-prime with TypeScript.',
    false,
  );

// Init program
program
  .version(pkg.version)
  .parse(process.argv);

export default program;

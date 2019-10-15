const program = require('commander');
const { TYPE } = require('./constants');
const pkg = require('../package.json');

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
    'Install react-prime with TypeScript. This is available for client and native.',
    false,
  );

// Init program
program
  .version(pkg.version)
  .parse(process.argv);

module.exports = program;
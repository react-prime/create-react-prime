import { program } from 'commander';
import pkg from '../package.json';
import App from './App';
import InterfaceMgr from './InterfaceMgr';
import { TYPE } from './constants';

// Commander has to be initialized at the very start of the application
// It is then passed along to InterfaceMgr

// Set options
program
  .option(
    '-t, --type <type>',
    `Install a type of react-prime. Options: ${Object.values(TYPE).join(', ')}`,
    TYPE.CLIENT,
  );

// Set other variables
program
  .version(pkg.version)
  .parse(process.argv);


// Initialize our interface handler
const interfaceMgr = new InterfaceMgr(program);

// Start app
new App(interfaceMgr);

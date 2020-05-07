import { Command } from 'commander';
import pkg from '../package.json';
import { BoilerplateConfigTypes } from './types';
import { TYPE } from './constants';

export default class Program {
  private interface = new Command();

  constructor() {
    this.interface
      // Set version equal to NPM version
      .version(pkg.version)
      // Grab arguments from Node
      .parse(process.argv);

    this.interface
      .option(
        '-t, --type <type>',
        `Install a type of react-prime. Options: ${Object.values(TYPE).join(', ')}`,
        TYPE.CLIENT,
      );
  }

  getInterface() {
    return this.interface;
  }

  getInstallType() {
    return this.interface.type as BoilerplateConfigTypes;
  }

  getArgs() {
    return this.interface.args;
  }
}

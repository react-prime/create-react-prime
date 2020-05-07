import Commander from 'commander';
import { BoilerplateConfigTypes } from './types';

export default class InterfaceMgr {
  private interface: Commander.Command;

  constructor(command: Commander.Command) {
    this.interface = command;
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

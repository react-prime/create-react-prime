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

  getInstallType(): BoilerplateConfigTypes {
    return this.interface.type;
  }

  getArgs() {
    return this.interface.args;
  }
}

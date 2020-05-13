import Commander from 'commander';
import { InstallerTypes } from './types';

export default class InterfaceMgr {
  private interface: Commander.Command;

  constructor(command: Commander.Command) {
    this.interface = command;
  }

  getInterface() {
    return this.interface;
  }

  getInstallType(): InstallerTypes {
    return this.interface.type;
  }

  getArgs() {
    return this.interface.args;
  }
}

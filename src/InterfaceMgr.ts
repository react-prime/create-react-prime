import Commander from 'commander';
import { InstallerTypes } from './types';

export default class InterfaceMgr {
  private interface: Commander.Command;

  constructor(command: Commander.Command) {
    this.interface = command;
  }

  getInterface(): Commander.Command {
    return this.interface;
  }

  getInstallType(): InstallerTypes {
    return this.interface.type;
  }

  getArgs(): string[] {
    return this.interface.args;
  }
}

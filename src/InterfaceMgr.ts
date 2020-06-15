import Commander from 'commander';
import { InstallerTypes } from './types';

export default class InterfaceMgr {
  private _interface: Commander.Command;

  constructor(command: Commander.Command) {
    this._interface = command;
  }


  get interface(): Commander.Command {
    return this._interface;
  }

  get installType(): InstallerTypes {
    return this.interface.type;
  }

  get args(): string[] {
    return this.interface.args;
  }
}

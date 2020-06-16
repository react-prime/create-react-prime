import Commander from 'commander';
import { InstallerTypes, InstallStepId } from './types';

export default class InterfaceMgr {
  private _interface: Commander.Command;

  constructor(command: Commander.Command) {
    this._interface = command;
  }


  get interface(): Commander.Command {
    return this._interface;
  }

  /** Args are passed without an option flag, i.e. the project name */
  get args(): string[] {
    return this.interface.args;
  }

  /** These values come from option flags, i.e. --type */
  get installType(): InstallerTypes {
    return this.interface.type;
  }

  get isDebugging(): boolean | undefined {
    return this.interface.debug;
  }

  get skipSteps(): InstallStepId[] | undefined {
    return this.interface.skipSteps;
  }
}

import Commander from 'commander';
import { InstallerTypes, InstallStepId } from './types';
import { ARG } from './constants';

/**
 * The Command Line Manager is used to keep the CLI program accessible
 * and abstract requesting data from the CLI program
 */
export default class CLIMgr {
  private _program: Commander.Command;

  constructor(command: Commander.Command) {
    this._program = command;
  }


  get program(): Commander.Command {
    return this._program;
  }

  get projectName(): string {
    return this.args[ARG.PROJECT_NAME];
  }

  /** These values come from option flags, i.e. --type */
  get installType(): InstallerTypes {
    return this.program.type;
  }

  get isDebugging(): boolean | undefined {
    return this.program.debug;
  }

  get skipSteps(): InstallStepId[] | undefined {
    return this.program.skipSteps;
  }


  /** Args are passed without an option flag, i.e. the project name */
  private get args(): string[] {
    return this.program.args;
  }
}

import * as i from 'types';
import { injectable, inject } from 'inversify';
import commander from 'commander';
import SERVICES from 'ioc/services';
import { ARG, REPOSITORIES } from './constants';

@injectable()
export default class CLIMgr implements i.CLIMgrType {
  private _projectName?: string;

  constructor(
    @inject(SERVICES.CLI) readonly cli: commander.Command,
  ) {}


  get installRepository(): string {
    return REPOSITORIES[this.installType];
  }

  /** These values come from option flags, i.e. --type */
  get installType(): i.InstallerTypes {
    return this.cli.type;
  }

  /** Args are passed without an option flag, i.e. the project name */
  get projectName(): string {
    return this._projectName || this.args[ARG.PROJECT_NAME] || this.installRepository;
  }

  set projectName(name: string) {
    this._projectName = name;
  }

  get isDebugging(): boolean | undefined {
    return this.cli.debug;
  }

  get skipSteps(): i.InstallStepId[] | undefined {
    return this.cli.skipSteps;
  }

  private get args(): string[] {
    return this.cli.args;
  }
}

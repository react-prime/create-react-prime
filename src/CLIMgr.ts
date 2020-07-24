import * as i from 'types';
import { injectable, inject } from 'inversify';
import commander from 'commander';
import SERVICES from 'ioc/services';
import { installationConfig } from 'installers/config';
import { ARG } from './constants';


@injectable()
export default class CLIMgr implements i.CLIMgrType {
  private _projectName?: string;

  constructor(
    @inject(SERVICES.CLI) readonly cli: commander.Command,
  ) {}


  /** These values come from option flags, i.e. --type */
  get lang(): i.InstallLangs {
    return this.cli.lang;
  }

  get installationLangConfig(): i.LangConfig {
    return installationConfig[this.lang];
  }

  get installationConfig(): i.InstallationConfig | undefined {
    if (!this.installType) {
      return;
    }

    return installationConfig[this.lang].type[this.installType];
  }

  get installType(): i.InstallTypes | undefined {
    return this.cli.type;
  }

  set installType(type: i.InstallTypes | undefined) {
    this.cli.type = type;
  }

  /** Args are passed without an option flag, i.e. the project name */
  get projectName(): string | undefined {
    return this._projectName || this.args[ARG.ProjectName];
  }

  set projectName(name: string | undefined) {
    this._projectName = name;
  }

  get isDebugging(): boolean {
    return this.cli.debug;
  }

  get skipSteps(): i.InstallStepIds[] {
    return this.cli.skipSteps;
  }

  get skipOptionalQuestions(): boolean {
    return this.cli.yes;
  }

  private get args(): string[] {
    return this.cli.args;
  }
}

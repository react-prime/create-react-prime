import * as i from 'types';
import { injectable, inject } from 'inversify';
import commander from 'commander';

import SERVICES from 'core/ioc/services';
import { ARG } from 'core/constants';

import installersConfig from 'modules/config';


@injectable()
export default class CLIMgr implements i.CLIMgrType {
  private _projectName?: string;

  constructor(
    @inject(SERVICES.CLI) readonly cli: commander.Command,
  ) {}


  /**
   * These next values come from option flags, i.e. --boilerplate
  */

  get lang(): i.InstallLangs {
    return this.cli.lang;
  }

  get installationLangConfig(): i.LangConfig {
    return installersConfig[this.lang];
  }

  get installationConfig(): i.InstallationConfig | undefined {
    if (!this.installBoilerplate) {
      return;
    }

    return installersConfig[this.lang].boilerplates[this.installBoilerplate];
  }

  get installBoilerplate(): i.BoilerplateTypes | undefined {
    return this.cli.boilerplate;
  }

  set installBoilerplate(boilerplate: i.BoilerplateTypes | undefined) {
    this.cli.boilerplate = boilerplate;
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

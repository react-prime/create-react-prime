import * as i from 'types';
import bootstrapCLI from 'core/cli';
import { ARG } from 'core/constants';
import scriptsMgr from 'core/ScriptsMgr';


// Create CLI ASAP in runtime
export const cliAPI__DO_NOT_USE__ = bootstrapCLI();

class CLIMgr {
  private cli = cliAPI__DO_NOT_USE__;
  private projectName?: string = this.cli.args[ARG.ProjectName];
  private boilerplate?: string = this.cli.opts<i.Opts>().boilerplate;
  private readonly boilerplateList: string[] = scriptsMgr.json().modules;

  getProjectName = (): string => {
    return this.projectName || this.cli.args[ARG.ProjectName];
  }

  setProjectName = (name: string): void => {
    this.projectName = name;
  }

  getBoilerplate = (): string => {
    return this.boilerplate || this.getOpts().boilerplate!;
  }

  setBoilerplate = (boilerplate: string): void => {
    this.boilerplate = boilerplate;
  }

  getBoilerplateList = (): string[] => {
    return this.boilerplateList;
  }


  private getOpts = (): i.Opts => {
    return this.cli.opts();
  }
}

const cliMgr = new CLIMgr();

export default cliMgr;

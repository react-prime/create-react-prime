import bootstrapCLI from './cli';

import { ARG } from 'core/constants';


// Create CLI ASAP in runtime
export const cliAPI__DO_NOT_USE__ = bootstrapCLI();

class CLIMgr {
  private cli = cliAPI__DO_NOT_USE__;
  private projectName: string = this.cli.args[ARG.ProjectName];
  private boilerplate: string = this.cli.opts().boilerplate;
  private boilerplateList: string[] = [];

  getProjectName = (): string => {
    return this.projectName || this.cli.args[ARG.ProjectName];
  }

  setProjectName = (name: string): void => {
    this.projectName = name;
  }

  getBoilerplate = (): string => {
    return this.boilerplate || this.cli.opts().boilerplate;
  }

  setBoilerplate = (boilerplate: string): void => {
    this.boilerplate = boilerplate;
  }

  getBoilerplateList = (): string[] => {
    return this.boilerplateList;
  }

  setBoilerplateList = (list: string[]): void => {
    this.boilerplateList = list;
  }
}

const cliMgr = new CLIMgr();

export default cliMgr;

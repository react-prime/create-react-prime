import commander from 'commander';

import bootstrapCLI from './cli';


// Create CLI ASAP in runtime
const cliAPI = bootstrapCLI();

class CLIMgr {
  private cli = cliAPI;
  private projectName: string = this.cli.args[0];
  private boilerplate: string = this.cli.opts().boilerplate;

  getCLI(): commander.Command {
    return this.cli;
  }

  getProjectName(): string {
    return this.projectName || this.cli.args[0];
  }

  setProjectName(name: string): void {
    this.projectName = name;
  }

  getBoilerplate(): string {
    return this.boilerplate || this.cli.opts().boilerplate;
  }

  setBoilerplate(boilerplate: string): string {
    return this.boilerplate = boilerplate;
  }
}

export default CLIMgr;

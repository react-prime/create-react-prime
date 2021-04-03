import commander from 'commander';

import bootstrapCLI from './cli';


// Create CLI ASAP in runtime
const cliAPI = bootstrapCLI();

class CLIMgr {
  private cli = cliAPI;
  private projectName: string = this.cli.args[0];

  getCLI(): commander.Command {
    return this.cli;
  }

  getProjectName(): string {
    return this.projectName;
  }

  setProjectName(name: string): void {
    this.projectName = name;
  }

  getBoilerplate(): string {
    return this.cli.opts().boilerplate;
  }
}

export default CLIMgr;

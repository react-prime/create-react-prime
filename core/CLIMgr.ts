import bootstrapCLI from './cli';


// Create CLI ASAP in runtime
const cliAPI = bootstrapCLI();

class CLIMgr {
  private cli = cliAPI;
  private projectName: string = this.cli.args[0];
  private boilerplate: string = this.cli.opts().boilerplate;

  getProjectName = (): string => {
    return this.projectName || this.cli.args[0];
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
}

const cliMgr = new CLIMgr();

export default cliMgr;

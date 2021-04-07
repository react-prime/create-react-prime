import bootstrapCLI from './cli';

import { ARG, ERROR_TEXT } from 'core/constants';
import Validate from 'core/Validate';
import Logger from 'core/Logger';


// Create CLI ASAP in runtime
const cliAPI = (() => {
  const cli = bootstrapCLI();

  // Parse user input
  cli.parse(process.argv);

  // Validate project name
  if (cli.args[ARG.ProjectName] != null) {
    const validate = new Validate();
    const logger = new Logger();

    if (!validate.folderName(cli.args[ARG.ProjectName])) {
      logger.error(ERROR_TEXT.ProjectName);
    }
  }

  return cli;
})();

class CLIMgr {
  private cli = cliAPI;
  private projectName: string = this.cli.args[ARG.ProjectName];
  private boilerplate: string = this.cli.opts().boilerplate;

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
}

const cliMgr = new CLIMgr();

export default cliMgr;

import fs from 'fs';
import Program, { CommanderStatic } from 'commander';
import pkg from '../package.json';
import { TYPE, ARG } from './constants';
import boilerplateConfig from './boilerplateConfig.json';
import installs from './installers';

export default class App {
  private static program: CommanderStatic;
  private static args: Args = {
    projectName: '',
  };
  private static installConfig: BoilerplateConfig;

  constructor() {
    this.init();
  }

  static getProjectName() {
    return App.args.projectName;
  }

  static setProjectName(name: string) {
    App.args.projectName = name;

    return App.args.projectName;
  }

  static getInstallConfig() {
    return App.installConfig;
  }

  private init() {
    this.initProgram();
    this.setVars();

    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(App.getProjectName())) {
      console.error(`Error: directory '${App.getProjectName()}' already exists.`);
      process.exit();
    }

    // run installation
    const installer = new installs[App.getInstallType()];

    installer
      .start()
      .finally(process.exit);
  }

  private static getInstallType() {
    return App.program.type as BoilerplateConfigTypes;
  }

  private initProgram() {
    App.program = Program;

    App.program
      // Set version equal to NPM version
      .version(pkg.version)
      // Grab arguments from Node
      .parse(process.argv);

    /* eslint-disable @typescript-eslint/indent */
    App.program
      .option<BoilerplateConfigTypes>(
        '-t, --type <type>',
        `Install a type of react-prime. Options: ${Object.values(TYPE).join(', ')}`,
        () => TYPE.CLIENT, // Not sure what this does
        TYPE.CLIENT,
      );
    /* eslint-enable */
  }

  private setVars() {
    App.args.projectName = App.program.args[ARG.PROJECT_NAME] || App.installConfig.boilerplate.name;

    App.installConfig = {
      owner: boilerplateConfig.owner,
      boilerplate: boilerplateConfig[App.getInstallType()],
    };
  }
}

type Args = {
  projectName: string;
}

type BoilerplateConfig = {
  owner: string;
  boilerplate: {
    name: string;
  };
}

type BoilerplateConfigTypes = Exclude<keyof typeof boilerplateConfig, 'owner'>;

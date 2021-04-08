import * as i from 'types';
import path from 'path';
import color from 'kleur';

import { ERROR_TEXT } from 'core/constants';
import cliMgr from 'core/CLIMgr';
import Logger from 'core/Logger';
import StepList from 'core/StepList';
import Prompt from 'core/Prompt';
import Validate from 'core/Validate';


export default class CRPApp {
  defaults = {
    steps: [] as i.Newable[],
    questions: [] as i.Newable[],
  };
  installers = [] as i.Newable[];

  start = async (): Promise<void> => {
    const logger = new Logger();


    // Initialize variables for the app
    this.init();


    // Run prompt
    const prompt = new Prompt(this.defaults.questions);
    await prompt.ask('before');


    // Get installer config
    const installer = this.getInstaller();

    if (!installer) {
      return logger.error('Something is wrong with this installation configuration.');
    }

    // Run installer prompt
    if (installer.questions) {
      const installerPrompt = new Prompt(installer.questions);
      await installerPrompt.ask('before');
    }

    logger.whitespace();


    // Run installation steps
    const steps = this.generateStepList(installer);
    const validate = new Validate();

    try {
      await installer.beforeInstall?.();

      // Check if folder exists before we continue
      if (validate.folderExists(cliMgr.getProjectName())) {
        return logger.error(ERROR_TEXT.DirectoryExists, cliMgr.getProjectName());
      }

      // Run installation steps
      await steps.execute();

      await installer.afterInstall?.();
    } catch (err) {
      logger.error(err);
    }

    logger.whitespace();


    // Run installation prompt
    if (installer.questions) {
      const installerPrompt = new Prompt(installer.questions);
      await installerPrompt.ask('after');
    }

    // Run prompt
    await prompt.ask('after');

    logger.whitespace();
  }

  end = async (): Promise<void> => {
    const logger = new Logger();
    const projectName = cliMgr.getProjectName();
    const projectPath = path.resolve(projectName);
    const styledProjectName = color.yellow().bold(projectName);
    const styledRepoName = color.dim(`(${cliMgr.getBoilerplate()})`);

    function formatText(cmd: string, desc: string): string {
      return `  ${cmd.padEnd(17)} ${color.dim(desc)}`;
    }

    logger.msg(`${styledProjectName} ${styledRepoName} was succesfully installed at ${color.cyan(projectPath)}\n`);
    logger.msg(`${color.bold().underline('Quickstart')}\n`);

    /* eslint-disable no-console */
    console.log(`  cd ${projectName}`);

    for (const str of this.instructions.quickstart) {
      console.log(`  ${str}`);
    }

    logger.whitespace();

    logger.msg(`${color.bold().underline('All commands')}\n`);

    for (const str of this.instructions.allCommands) {
      console.log(formatText(str.cmd, str.desc));
    }
    /* eslint-enable */
  }


  private init = (): void => {
    // Add all boilerplate names to a list
    const list: string[] = [];
    for (const I of this.installers) {
      const installer = new I() as i.Installer;
      list.push(installer.options.name);
    }

    cliMgr.setBoilerplateList(list);
  }

  private getInstaller = (): i.Installer | undefined => {
    let installer: i.Installer | undefined = undefined;
    let found = false;
    let i = 0;

    while (!found) {
      installer = new this.installers[i++]() as i.Installer;

      if (installer.options.name === cliMgr.getBoilerplate()) {
        found = true;
      }
    }

    return installer;
  }

  private generateStepList = (installer: i.Installer): StepList => {
    const customSteps = installer.steps?.map((Step) => new Step() as i.Step);
    const stepList = new StepList(installer.options);

    for (const Step of this.defaults.steps) {
      const s = new Step() as i.Step;
      stepList.push(s);

      if (customSteps) {
        for (const cStep of customSteps) {
          if (s.name === cStep.after) {
            stepList.push(cStep);
          }
        }
      }
    }

    return stepList;
  }

  private instructions = {
    quickstart: ['npm start'],
    allCommands: [
      {
        cmd: 'npm start',
        desc: 'Start your development server',
      },
      {
        cmd: 'npm run build',
        desc: 'Build your website for production',
      },
      {
        cmd: 'npm run server',
        desc: 'Start your production server',
      },
    ],
  };
}

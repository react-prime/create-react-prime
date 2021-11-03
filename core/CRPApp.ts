import * as i from 'types';
import path from 'path';
import color from 'kleur';
import { Answers } from 'inquirer';

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


  start = async (): Promise<void> => {
    this.startMessage();

    const logger = new Logger();
    let answers = {} as Answers;


    // Run prompt
    const prompt = new Prompt(this.defaults.questions);
    let a = await prompt.ask('before');

    answers = { ...answers, ...a };


    // Get installer config
    const installer = this.getInstaller();

    if (!installer) {
      return logger.error('Something is wrong with this installation configuration.');
    }

    // Run installer prompt
    if (installer.questions) {
      const installerPrompt = new Prompt(installer.questions);
      a = await installerPrompt.ask('before');

      answers = { ...answers, ...a };
    }

    logger.whitespace();


    // Run installation steps
    const steps = this.generateStepList(installer, answers);
    const validate = new Validate();

    try {
      await installer.beforeInstall?.();

      // Check if folder exists before we continue
      if (validate.folderExists(cliMgr.getProjectName())) {
        return logger.error(ERROR_TEXT.DirectoryExists, cliMgr.getProjectName());
      }

      // Run installation steps
      await steps.execute(installer.options);

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
    const styledProjectPath = color.cyan(projectPath);

    function formatText(cmd: string, desc: string): string {
      return `  ${cmd.padEnd(17)} ${color.dim(desc)}`;
    }

    logger.msg(`${styledProjectName} ${styledRepoName} was succesfully installed at ${styledProjectPath}`);
    logger.whitespace();
    logger.msg(`${color.bold().underline('Quickstart')}`);
    logger.whitespace();

    /* eslint-disable no-console */
    console.log(`  cd ${projectName}`);

    for (const str of this.instructions.quickstart) {
      console.log(`  ${str}`);
    }

    logger.whitespace();
    logger.msg(`${color.bold().underline('All commands')}`);
    logger.whitespace();

    for (const str of this.instructions.allCommands) {
      console.log(formatText(str.cmd, str.desc));
    }
    /* eslint-enable */
  }

  // Startup msg
  startMessage = (): void => {
    const logger = new Logger();

    const packageName = color.yellow().bold(process.env.NAME!);
    const version = process.env.VERSION;

    logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}`);

    logger.whitespace();
  }

  getInstaller = (): i.Installer | undefined => {
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

  generateStepList = (installer: i.Installer, answers: Answers): StepList => {
    const customSteps = installer.steps?.map((Step) => new Step() as i.Step);
    const stepList = new StepList();

    for (const Step of this.defaults.steps) {
      const s = new Step() as i.Step;

      if (!s.when || s.when(answers)) {
        stepList.push(s);
      }

      if (customSteps) {
        for (const cStep of customSteps) {
          if (s.name === cStep.after) {
            if (!cStep.when || cStep.when(answers)) {
              stepList.push(cStep);
            }
          }
        }
      }
    }

    if (customSteps) {
      for (const cStep of customSteps) {
        if (!cStep.after) {
          if (!cStep.when || cStep.when(answers)) {
            stepList.push(cStep);
          }
        }
      }
    }

    return stepList;
  }
}

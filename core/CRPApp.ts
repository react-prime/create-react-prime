import * as i from 'types';

import { ERROR_TEXT } from 'core/constants';
import cliMgr from 'core/CLIMgr';
import Logger from 'core/Logger';
import StepList from 'core/StepList';
import Prompt from 'core/Prompt';
import Validate from 'core/Validate';
import MainPrompt from 'core/MainPrompt';


export default class CRPApp {
  defaults = {
    steps: [] as i.Newable[],
    questions: [] as i.Newable[],
  };
  installers = [] as i.Newable[];


  start = async (): Promise<void> => {
    const logger = new Logger();


    // Run prompt
    const prompt = new MainPrompt(this.defaults.questions);
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
  }

  end = async (): Promise<void> => {
    return;
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
}

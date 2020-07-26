import * as i from 'types';
import commander, { Command } from 'commander';

import Validate from 'core/utils/Validate';
import Logger from 'core/utils/Logger';
import { ARG, ERROR_TEXT } from 'core/constants';

import installersConfig from 'modules/config';
import STEPS from 'modules/steps/identifiers';


export default function initCLI(): commander.Command {
  const logger = new Logger();

  // Initiate cli program
  const cli = new Command();

  // Set options
  const installStepIdList = Object.values(STEPS).join(', ');

  const repos: string[] = [];
  const langs: string[] = [];

  for (const lang in installersConfig) {
    langs.push(lang);

    for (const repo in installersConfig[lang]) {
      repos.push(repo);
    }
  }

  cli.option(
    '-l, --lang <lang>',
    `What programming language you will use. Options: ${langs.join(', ')}`,
    'js',
  );

  cli.option(
    '-t, --type <type>',
    `Install given boilerplate. Options: ${repos.join(', ')}`,
  );

  cli.option(
    '-d, --debug',
    'Show additional information when running the installer',
    false,
  );

  cli.option(
    '-s, --skipSteps <steps>',
    `Skip an install step. You can pass a comma separated list for multiple steps. Options: ${installStepIdList}`,
    // Map from comma separated string list to array
    (value) => {
      const skipSteps = value.replace(' ', '').split(',') as i.InstallStepIds[];
      const invalidSteps: string[] = [];

      // Check if any of the given steps is invalid
      for (const step of skipSteps) {
        // Given step can be invalid
        const invalidStep = !Object.values(STEPS).includes(step);

        if (invalidStep) {
          invalidSteps.push(step);
        }
      }

      if (invalidSteps.length > 0) {
        const stepsToStr = invalidSteps
          .map((str) => `'${str}'`)
          .join(', ');

        logger.error(
          `Error in --skipSteps. ${stepsToStr} is/are invalid. Available steps: ${installStepIdList}`,
        );

        process.exit(1);
      }

      return skipSteps;
    },
    [],
  );

  cli.option(
    '-y, --yes',
    'Skip all optional questions',
    false,
  );

  // Set other variables
  cli.version(process.env.npm_package_version!);
  cli.parse(process.argv);

  // Validate project name
  if (cli.args[ARG.ProjectName] != null) {
    const validate = new Validate();

    if (!validate.filename(cli.args[ARG.ProjectName])) {
      logger.error(ERROR_TEXT.Filename);
    }
  }

  return cli;
}

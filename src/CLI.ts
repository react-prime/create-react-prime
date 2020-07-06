import commander, { Command } from 'commander';
import { installerCfg } from './installers/config';
import { INSTALL_STEP } from './installers/steps';

function initCLI(): commander.Command {
  // Initiate cli program
  const cli = new Command();

  // Set options
  const installStepIdList = INSTALL_STEP.join(', ');

  cli.option(
    '-t, --type <type>',
    `Install a type of react-prime. Options: ${installerCfg.map((cfg) => cfg.name).join(', ')}`,
    'client',
  );

  cli.option(
    '-d, --debug',
    'Show additional information when running the installer.',
  );

  cli.option(
    '-s, --skipSteps <steps>',
    `Skip an install step. You can pass a comma separated list for multiple steps. Options: ${installStepIdList}`,
    // Map from comma separated string list to array
    (value) => {
      const skipSteps = value.replace(' ', '').split(',');
      const invalidSteps: string[] = [];

      // Check if any of the given steps is invalid
      for (const step of skipSteps) {
        // Given step can !== stepId, that's the point of this check!
        // @ts-ignore
        const invalidStep = !INSTALL_STEP.includes(step);

        if (invalidStep) {
          invalidSteps.push(step);
        }
      }

      if (invalidSteps.length > 0) {
        const stepsToStr = invalidSteps
          .map((str) => `'${str}'`)
          .join(', ');

        console.error(
          `Error in --skipSteps. ${stepsToStr} is/are invalid. Available steps: ${installStepIdList}`,
        );

        process.exit(1);
      }

      return skipSteps;
    },
  );

  // Set other variables
  cli.version('$version');
  cli.parse(process.argv);

  return cli;
}

export default initCLI;

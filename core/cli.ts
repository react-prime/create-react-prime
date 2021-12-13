import * as i from 'types';
import commander, { Command } from 'commander';

import { ARG, ERROR_TEXT } from 'core/constants';
import Validate from 'core/Validate';
import Logger from 'core/Logger';

import CLIOptions from 'cli/CLI';


export default function bootstrapCLI(): commander.Command {
  const cli = new Command();
  const logger = new Logger();

  cli.version(process.env.VERSION!);

  let forceExit = false;

  for (const Option of new CLIOptions().options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const option = new Option() as i.CLIOption<any>;

    cli
      .option(option.flags, option.description, option.defaultValue)
      .action((flags, options) => {
        option.on?.(flags, options);

        for (const flag in flags) {
          if (flag === option.getName() && option.terminate) {
            forceExit = true;
          }
        }
      });
  }

  // Parse user input
  cli.parse(process.argv);

  // Exit app if one of the options has the terminate option
  if (forceExit) {
    logger.whitespace();
    process.exit(0);
  }

  // Validate project name
  if (cli.args[ARG.ProjectName] != null) {
    const validate = new Validate();

    if (!validate.folderName(cli.args[ARG.ProjectName])) {
      logger.error(ERROR_TEXT.ProjectName);
    }
  }

  return cli;
}

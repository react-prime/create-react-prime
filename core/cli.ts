import commander, { Command } from 'commander';

import { ARG, ERROR_TEXT } from 'core/constants';
import Validate from 'core/Validate';
import Logger from 'core/Logger';
import scriptsMgr from 'core/ScriptsMgr';


export default function bootstrapCLI(): commander.Command {
  const cli = new Command();

  cli.version(process.env.VERSION!);

  cli.option(
    '-b, --boilerplate <boilerplate>',
    `Install chosen boilerplate. Options: ${scriptsMgr.json().modules.join(', ')}`,
  );

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
}

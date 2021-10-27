import fs from 'fs';
import path from 'path';
import commander, { Command } from 'commander';

import { ARG, ERROR_TEXT } from 'core/constants';
import Validate from 'core/Validate';
import Logger from 'core/Logger';


export default function bootstrapCLI(): commander.Command {
  const cli = new Command();

  cli.version(process.env.VERSION!);

  // Extract the names of all installable boilerplates from their folder name
  const modules = fs.readdirSync(path.resolve('modules'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name.toLowerCase() !== 'defaults');

  cli.option(
    '-b, --boilerplate <boilerplate>',
    `Install chosen boilerplate. Options: ${modules.join(', ')}`,
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

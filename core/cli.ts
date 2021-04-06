import commander, { Command } from 'commander';

import { ARG, ERROR_TEXT } from 'core/constants';
import Validate from 'core/Validate';
import Logger from 'core/Logger';


export default function bootstrapCLI(): CLI {
  const cli = new Command() as CLI;

  cli.option(
    '-b, --boilerplate <boilerplate>',
    'Install chosen boilerplate. Options: react-spa, react-ssr, react-native',
  );

  cli.version(process.env.VERSION!);
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

interface CLI extends commander.Command {
  opts(): {
    boilerplate: string;
  };
}

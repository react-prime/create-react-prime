import { Command } from 'commander';
import gitUsername from 'git-user-name';
import { state } from '@crp';
import { db } from '@crp/db';

import { addOptions } from '../src/cli/options';


const cli = new Command();

export async function bootstrap(): Promise<Command> {
  // Set CLI version to package.json version
  cli.version(process.env.VERSION!);

  // Add flags/options to the CLI
  addOptions(cli);

  // Parse user input
  cli.parse(process.argv);

  // Add new usage to db
  if (process.env.NODE_ENV !== 'test') {
    db.session.create({
      data: {
        gitUsername: gitUsername(),
      },
    })
      .then((data) => {
        state.session.id = data.id;
      });
  }

  return cli;
}

export default cli;

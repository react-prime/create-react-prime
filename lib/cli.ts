import { Command } from 'commander';

import { addOptions } from 'src/cli/options';


const cli = new Command();

export async function bootstrap(): Promise<Command> {
  // Set CLI version to package.json version
  cli.version(process.env.VERSION!);

  // Add flags/options to the CLI
  addOptions(cli);

  // Parse user input
  cli.parse(process.argv);

  return cli;
}

export default cli;

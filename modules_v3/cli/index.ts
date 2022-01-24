import { Command } from 'commander';

import addOptions from './options';
import * as actions from './actions';


export const ARGS = {
  ProjectName: 0,
};

let cli: Command;

export async function bootstrap(): Promise<void> {
  cli = new Command();

  // Set CLI version to package.json version
  cli.version(process.env.VERSION!);

  // Add flags/options to the CLI
  addOptions(cli);

  // Parse user input
  cli.parse(process.argv);

  // Actions
  await actions.installBoilerplate(cli);
}

export default cli;

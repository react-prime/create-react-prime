import { Command } from 'commander';

import { addOptions } from '../src/cli/options';
import { CLI_ARGS } from './constants';

export const command = new Command();

export async function bootstrap(): Promise<Command> {
  // Set CLI version to package.json version
  command.version(process.env.VERSION!);

  // Add flags/options to the CLI
  addOptions(command);

  // Parse user input
  command.parse(process.argv);

  return command;
}

export function getArg(arg: keyof typeof CLI_ARGS): string {
  const _arg = CLI_ARGS[arg];
  return command.args[_arg];
}

export function getOptions(): ReturnType<typeof command.opts> {
  return command.opts();
}

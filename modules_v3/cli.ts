import { Command } from 'commander';

import * as utils from './utils';

type CLIOptions = {
  boilerplate?: string;
}

declare module 'commander' {
  export interface Command {
    opts(): CLIOptions;
    action(fn: (flags: CLIOptions) => void | Promise<void>): this;
  }
}

export const ARGS = {
  ProjectName: 0,
};

const cli = new Command();

// Set CLI version to package.json version
cli.version(process.env.VERSION!);

cli
  .option('-b, --boilerplate <boilerplate>')
  .description(`Install chosen boilerplate. Options: ${utils.getBoilerplates()}`)
  .action((flags) => {
    console.log(flags);
  });

// Parse user input
cli.parse(process.argv);

export default cli;

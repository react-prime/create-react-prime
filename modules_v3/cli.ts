#!/usr/bin/env ts-node
import commander, { Command } from 'commander';

import * as utils from './utils';
import state from './state';

type CLIOptions = {
  boilerplate?: string;
}

declare module 'commander' {
  export interface Command {
    opts(): CLIOptions;
  }
}

const ARGS = {
  ProjectName: 0,
};

const cli = new Command();

// Set CLI version to package.json version
cli.version(process.env.VERSION!);

cli
  .option('-b, --boilerplate <boilerplate>')
  .description(`Install chosen boilerplate. Options: ${utils.getBoilerplates()}`)
  .action((flags, options) => {
    console.log(flags);
    console.log(options);
  });

// Parse user input
cli.parse(process.argv);

const opts = cli.opts();

export default cli;

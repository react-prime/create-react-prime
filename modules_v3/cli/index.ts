import { Command } from 'commander';

import addOptions from './options';


export const ARGS = {
  ProjectName: 0,
};

const cli = new Command();

// Set CLI version to package.json version
cli.version(process.env.VERSION!);

addOptions(cli);

// Parse user input
cli.parse(process.argv);

export default cli;

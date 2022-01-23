import { Command } from 'commander';

import addOptions from './options';


const cli = new Command();

// Set CLI version to package.json version
cli.version(process.env.VERSION!);

addOptions(cli);

// Parse user input
cli.parse(process.argv);

export default cli;

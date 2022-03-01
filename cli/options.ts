import type { Command } from 'commander';


function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate')
    .description('Install a boilerplate');

  cli
    .option('-d, --debug')
    .description('Enable debug mode (verbose logging)');
}

export default addOptions;

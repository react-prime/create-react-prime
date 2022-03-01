import type { Command } from 'commander';


function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate', 'Install a boilerplate')
    .option('-d, --debug', 'Enable debug mode (verbose logging)');
}

export default addOptions;

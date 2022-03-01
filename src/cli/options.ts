import type { Command } from 'commander';


export function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate', 'Install a boilerplate')
    .option('-d, --debug', 'Enable debug mode (verbose logging)');
}

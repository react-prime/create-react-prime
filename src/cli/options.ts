import type { Command } from 'commander';

export function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate', 'Install a boilerplate')
    .option('-m, --modules', 'Install modules')
    .option('-c, --components', 'Install components')
    .option('-d, --debug', 'Enable debug mode (verbose logging)')
    .option('-t, --tracking', 'Update tracking settings');
}

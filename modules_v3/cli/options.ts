import type { Command } from 'commander';

import { getInstallers } from '../lib/utils';


function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate <boilerplate>')
    .description(`Install chosen boilerplate. Options: ${getInstallers().join(', ')}`);
}

export default addOptions;

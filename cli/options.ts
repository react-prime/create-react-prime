import type { Command } from 'commander';

import json from '../lib/generated/crp.json';


function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate <boilerplate>')
    .description(`Install chosen boilerplate. Options: ${json.modules.join(', ')}`);
}

export default addOptions;

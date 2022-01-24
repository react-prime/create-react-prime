import type { Command } from 'commander';

import * as utils from '../utils';


function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate <boilerplate>')
    .description(`Install chosen boilerplate. Options: ${utils.getBoilerplates()}`);
}

export default addOptions;

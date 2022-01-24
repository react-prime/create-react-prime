import type { Command } from 'commander';

import * as utils from '../utils';
import { boilerplate } from './actions';


function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate <boilerplate>')
    .description(`Install chosen boilerplate. Options: ${utils.getBoilerplates()}`)
    .action((flags) => boilerplate(flags, cli));
}

export default addOptions;

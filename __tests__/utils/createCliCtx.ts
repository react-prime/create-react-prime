import * as i from 'types';
import commander from 'commander';

import CLIMgr from 'core/CLIMgr';
import initCLI from 'core/CLI';


type CliCtx = {
  cli: commander.Command;
  cliMgr: i.CLIMgrType;
}


function createCliCtx(): CliCtx {
  const cli = initCLI();

  return {
    cli,
    cliMgr: new CLIMgr(cli),
  };
}

export default createCliCtx;

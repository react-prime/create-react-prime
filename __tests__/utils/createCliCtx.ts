import * as i from 'types';
import commander, { Command } from 'commander';
import CLIMgr from 'src/CLIMgr';
import initCLI from 'src/CLI';


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

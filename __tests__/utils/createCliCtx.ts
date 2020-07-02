import * as i from 'types';
import commander from 'commander';
import initCLI from 'src/CLI';
import CLIMgr from 'src/CLIMgr';

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

import { exec } from 'child_process';
import color from 'kleur';
import { cli } from '@crp';
import { logger } from '@crp/utils';

import { entry } from 'src/cli/actions/entry';
import { updateOperationResult } from './db';
import { DOWNLOADED_MONOREPO_FOLDER_NAME } from './modules/constants';

async function main() {
  // Show startup text
  start();

  // Parse CLI arguments
  const app = await cli.bootstrap();

  // Find and run entry point for given CLI option
  try {
    const action = await entry(app.opts());
    await action();

    // Exit application
    await updateOperationResult({ result: 'success' });
    process.exit();
  } finally {
    // Always delete the install folder, also when something goes wrong
    exec(`rm -rf ${DOWNLOADED_MONOREPO_FOLDER_NAME}`);
  }
}

export function start(): void {
  const packageName = color.yellow().bold(process.env.NAME);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}`);
  logger.whitespace();
}

main();

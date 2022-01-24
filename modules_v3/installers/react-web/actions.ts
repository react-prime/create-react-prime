import { exec } from 'child_process';
import { promisify  } from 'util';
import ora from 'ora';

import { LOG_PREFIX } from '../../../core/constants';
import logger from '../../../core/Logger';
import state from '../../state';

export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.get('answers');

  const spinner = ora(`🚚  Cloning '${boilerplate}' into '${projectName}'...`);
  spinner.color = 'yellow';
  spinner.prefixText = LOG_PREFIX;
  spinner.start();

  try {
    await promisify(exec)(`git clone ${url} ${projectName}`);
    spinner.succeed(`🚚  Cloned '${boilerplate}' into '${projectName}'!`);
  } catch (err) {
    spinner.fail('Something went wrong while cloning. Aborting.');
    logger.error(err);
  }
}

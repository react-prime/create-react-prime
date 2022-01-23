import { exec } from 'child_process';
import { promisify  } from 'util';
import ora from 'ora';

import { LOG_PREFIX } from '../../core/constants';

export async function clone(url: string, name: string, boilerplate: string): Promise<void> {
  const spinner = ora(`🚚  Cloning '${boilerplate}' into '${name}'...`);
  spinner.color = 'yellow';
  spinner.prefixText = LOG_PREFIX;
  spinner.start();

  try {
    await promisify(exec)(`git clone ${url} ${name}`);
    spinner.succeed(`🚚  Cloned '${boilerplate}' into '${name}'!`);
  } catch (err) {
    spinner.fail('Something went wrong while cloning. Aborting.');
    console.error(err);
    process.exit(1);
  }
}

/* eslint-disable no-console */
import type * as i from 'types';
import color from 'kleur';
import { cli } from '@crp';
import { LOG_PREFIX } from '@crp/constants';

import { updateOperationResult } from 'src/db';

class Logger {
  readonly warningMsg = color.yellow('WRN');
  readonly errorMsg = `${color.red('ERR!')} Installation aborted.`;

  msg(...str: i.AnyArr): void {
    this.log('⚡️', ...str);
  }

  warning(...reason: i.AnyArr): void {
    this.log(this.warningMsg, ...reason);
  }

  /**
   * @throws {Error}
   */
  async error(...reason: i.AnyArr): Promise<never> {
    return updateOperationResult({
      result: 'error',
      error: reason.join(' '),
    }).then(() => {
      this.log(this.errorMsg, ...reason);

      if (cli.opts().debug) {
        console.trace();
      }

      process.exit(1);
    });
  }

  whitespace(): void {
    console.log();
  }

  private log(prefix: string, ...str: i.AnyArr): void {
    const pre = `${LOG_PREFIX} ${prefix}`;
    const [first, ...rest] = str;

    console.log(`\n${pre} ${first}`, ...rest);
  }
}

export const logger = new Logger();

/* eslint-disable no-console */
import type * as i from 'types';
import color from 'kleur';
import { cli } from '@crp';
import { LOG_PREFIX } from '@crp/constants';
import { updateSessionResult } from '@crp/db';


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
    return updateSessionResult('error', {
      error: reason.join(' '),
    })
      .then(() => {
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

const logger = new Logger();
export { logger };

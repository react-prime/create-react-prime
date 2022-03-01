/* eslint-disable no-console */
import type * as i from 'types';
import color from 'kleur';
import { cli } from '@crp';
import { LOG_PREFIX } from '@crp/constants';


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
  error(...reason: i.AnyArr): never {
    this.log(this.errorMsg, ...reason);

    if (cli.opts().debug) {
      console.trace();
    }

    process.exit(1);
  }

  whitespace(): void {
    console.log();
  }

  private log(prefix: string, ...str: i.AnyArr): void {
    const pre = `${LOG_PREFIX} ${prefix}`;
    const [first, ...rest] = str;

    console.log(`${pre} ${first}`, ...rest);
  }
}

const logger = new Logger();
export { logger };

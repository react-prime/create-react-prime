/* eslint-disable no-console */
import type * as i from 'types';
import color from 'kleur';

import { LOG_PREFIX } from './constants';


class Logger {
  readonly warningMsg = color.yellow('WRN');
  readonly errorMsg = `${color.red('ERR!')} Installation aborted:`;

  msg(...str: i.AnyArr): void {
    this.log('⚡️', ...str);
  }

  warning(...reason: i.AnyArr): void {
    this.log(this.warningMsg, ...reason);
  }

  error(...reason: i.AnyArr): void {
    this.log(this.errorMsg, ...reason);
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
export default logger;

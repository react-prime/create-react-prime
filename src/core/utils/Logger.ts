/* eslint-disable no-console */
import * as i from 'types';
import { injectable } from 'inversify';
import color from 'kleur';

import { LOG_PREFIX } from 'core/constants';


@injectable()
export default class Logger implements i.LoggerType {
  msg(...str: i.AnyArr): void {
    this.log('⚡️', ...str);
  }

  warning(...reason: i.AnyArr): void {
    this.log(color.yellow('WRN'), ...reason);
  }

  error(...reason: i.AnyArr): void {
    this.log(`${color.red('ERR!')} Installation aborted.`, ...reason);
    process.exit(1);
  }

  debug(...str: i.AnyArr): void {
    this.log(color.red('DBG'), ...str);
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

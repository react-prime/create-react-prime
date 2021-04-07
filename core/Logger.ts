/* eslint-disable no-console */
import * as i from 'types';
import color from 'kleur';

import { LOG_PREFIX } from './constants';


export default class Logger {
  msg(...str: i.AnyArr): void {
    this.log('⚡️', ...str);
  }

  warning(...reason: i.AnyArr): void {
    this.log(color.yellow('WRN'), ...reason);
  }

  error(...reason: i.AnyArr): void {
    this.log(`${color.red('ERR!')} Installation aborted:`, ...reason);
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

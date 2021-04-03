/* eslint-disable no-console */
import * as i from 'types';
import color from 'kleur';


export default class Logger {
  private LOG_PREFIX = 'crp';

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
    const pre = `${this.LOG_PREFIX} ${prefix}`;
    const [first, ...rest] = str;

    console.log(`${pre} ${first}`, ...rest);
  }
}

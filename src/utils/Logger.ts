/* eslint-disable no-console */
import * as i from 'types';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';
import { LOG_PREFIX } from '../constants';
import Text from './Text';

@injectable()
export default class Logger implements i.LoggerType {
  private text = new Text();

  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
  ) {}


  msg(...str: i.AnyArr): void {
    this.log('⚡️', ...str);
  }

  warning(...reason: i.AnyArr): void {
    this.log(this.text.yellow('WRN'), ...reason);
  }

  error(...reason: i.AnyArr): void {
    this.log(this.text.red('ERR!'), 'Installation aborted.', ...reason);
    process.exit(1);
  }

  debug(...str: i.AnyArr): void {
    if (this.cliMgr.isDebugging) {
      this.log(this.text.red('DBG'), ...str);
    }
  }

  whitespace(): void {
    console.log();
  }

  private log(prefix: string, ...str: i.AnyArr): void {
    console.log(LOG_PREFIX, prefix, ...str);
  }
}

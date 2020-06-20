import { injectable, inject } from 'inversify';
import { TEXT } from './constants';
import { LoggerType, CLIMgrType } from './ioc';
import SERVICES from './ioc/services';

@injectable()
export default class Logger implements LoggerType {
  @inject(SERVICES.CLIMgr) private readonly cliMgr!: CLIMgrType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...reason: any[]): void {
    this.log('ERR!', 'Installation aborted.', ...reason);
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...text: any[]): void {
    if (this.cliMgr.isDebugging) {
      this.log('DEBUG', ...text);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(prefix: string, ...str: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`${TEXT.RED}${prefix}${TEXT.DEFAULT}`, ...str);
  }
}

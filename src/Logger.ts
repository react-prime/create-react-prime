import { injectable } from 'inversify';
import { TEXT } from './constants';

@injectable()
export default class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...reason: any[]): void {
    this.log('ERR!', 'Installation aborted.', ...reason);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(prefix: string, ...str: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`${TEXT.RED}${prefix}${TEXT.DEFAULT}`, ...str);
  }
}

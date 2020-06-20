import * as i from 'types';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';
import { TEXT } from './constants';

@injectable()
export default class Logger implements i.LoggerType {
  @inject(SERVICES.CLIMgr) private readonly cliMgr!: i.CLIMgrType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warning(...reason: any[]): void {
    this.log({ prefix: 'WARNING', color: 'YELLOW' }, ...reason);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...reason: any[]): void {
    this.log({ prefix: 'ERR!' }, 'Installation aborted.', ...reason);
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...text: any[]): void {
    if (this.cliMgr.isDebugging) {
      this.log({ prefix: 'DEBUG' }, ...text);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(options: LogOptions, ...str: any[]): void {
    const color = options.color ? TEXT[options.color] : TEXT.RED;

    // eslint-disable-next-line no-console
    console.log(`create-react-prime ${color}${options.prefix}${TEXT.DEFAULT}`, ...str);
  }
}

type LogOptions = {
  prefix: string;
  color?: keyof typeof TEXT;
}

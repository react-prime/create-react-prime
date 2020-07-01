/* eslint-disable no-console */
import 'reflect-metadata';
import { LOG_PREFIX, TEXT } from 'src/constants';
import Logger from 'src/Logger';
import CLIMgr from 'src/CLIMgr';
import cli from 'src/CLI';

describe('Logger', () => {
  const orgLog = console.log;

  const ctx = new class Ctx {
    logSpy = jest.spyOn(console, 'log');
    get logger() { return new Logger(this.cliMgr); }

    private get cliMgr() { return new CLIMgr(cli); }
  };

  beforeAll(() => {
    // Supress console.log output from tests
    console.log = jest.fn();
  });

  beforeEach(() => {
    ctx.logSpy = jest.spyOn(console, 'log');
    ctx.logSpy.mockClear();
  });

  afterAll(() => {
    console.log = orgLog;
  });

  describe('warning', () => {
    const warningPrefix = `${LOG_PREFIX} ${TEXT.YELLOW}WARNING${TEXT.DEFAULT}`;

    it('Logs text with a warning prefix', () => {
      ctx.logger.warning('test');
      ctx.logger.warning('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([
        [warningPrefix, 'test'],
        [warningPrefix, 'test', 'test2'],
      ]);
    });
  });

  describe('error', () => {
    const errorPrefix = [`${LOG_PREFIX} ${TEXT.RED}ERR!${TEXT.DEFAULT}`, 'Installation aborted.'];
    const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

    it('Logs error text with an error prefix and exits with code 1', () => {
      ctx.logger.error('test');
      ctx.logger.error('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([
        [...errorPrefix, 'test'],
        [...errorPrefix, 'test', 'test2'],
      ]);

      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('debug', () => {
    const debugPrefix = `${LOG_PREFIX} ${TEXT.RED}DEBUG${TEXT.DEFAULT}`;

    it('Does not output text when debug flag is false', () => {
      ctx.logger.debug('test');
      ctx.logger.debug('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([]);
    });

    it('Outputs text when debug flag is true', () => {
      // Simulate using the debug option
      cli.debug = true;

      ctx.logger.debug('test');
      ctx.logger.debug('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([
        [debugPrefix, 'test'],
        [debugPrefix, 'test', 'test2'],
      ]);
    });
  });
});

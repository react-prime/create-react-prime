/* eslint-disable no-console */
import 'reflect-metadata';
import { LOG_PREFIX, TEXT } from 'src/constants';
import Logger from 'src/utils/Logger';
import mockConsole from './utils/mockConsole';
import createCliCtx from './utils/createCliCtx';

describe('Logger', () => {
  const restoreConsole = mockConsole();

  const ctx = new class Ctx {
    logSpy = jest.spyOn(console, 'log');

    createLoggerCtx() {
      const { cli, cliMgr } = createCliCtx();

      return {
        cli,
        logger: new Logger(cliMgr),
      };
    }
  };

  beforeEach(() => {
    ctx.logSpy = jest.spyOn(console, 'log');
    ctx.logSpy.mockClear();
  });

  afterAll(() => {
    restoreConsole();
  });

  describe('warning', () => {
    const warningPrefix = `${LOG_PREFIX} ${TEXT.YELLOW}WARNING${TEXT.DEFAULT}`;

    it('Logs text with a warning prefix', () => {
      const { logger } = ctx.createLoggerCtx();

      logger.warning('test');
      logger.warning('test', 'test2');

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
      const { logger } = ctx.createLoggerCtx();

      logger.error('test');
      logger.error('test', 'test2');

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
      const { logger } = ctx.createLoggerCtx();

      logger.debug('test');
      logger.debug('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([]);
    });

    it('Outputs text when debug flag is true', () => {
      const { logger, cli } = ctx.createLoggerCtx();

      // Simulate using the debug option
      cli.debug = true;

      logger.debug('test');
      logger.debug('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([
        [debugPrefix, 'test'],
        [debugPrefix, 'test', 'test2'],
      ]);
    });
  });
});

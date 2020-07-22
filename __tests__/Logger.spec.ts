/* eslint-disable no-console */
import 'reflect-metadata';
import { LOG_PREFIX } from 'src/constants';
import Logger from 'src/utils/Logger';
import Text from 'utils/Text';
import mockConsole from './utils/mockConsole';
import createCliCtx from './utils/createCliCtx';

describe('Logger', () => {
  const restoreConsole = mockConsole();
  const text = new Text();

  const ctx = new class {
    logSpy = jest.spyOn(console, 'log');

    createLoggerCtx() {
      const { cli } = createCliCtx();

      return {
        cli,
        logger: new Logger(),
      };
    }
  };

  beforeEach(() => {
    ctx.logSpy.mockClear();
  });

  afterAll(() => {
    restoreConsole();
  });

  describe('warning', () => {
    const warningPrefix = [LOG_PREFIX, text.yellow('WRN')];

    it('Logs text with a warning prefix', () => {
      const { logger } = ctx.createLoggerCtx();

      logger.warning('test');
      logger.warning('test', 'test2');

      const result1 = [...warningPrefix, 'test'].join(' ');

      expect(ctx.logSpy.mock.calls).toEqual([
        [result1],
        [result1, 'test2'],
      ]);
    });
  });

  describe('error', () => {
    const errorPrefix = [LOG_PREFIX, text.red('ERR!'), 'Installation aborted.'].join(' ');
    const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

    it('Logs error text with an error prefix and exits with code 1', () => {
      const { logger } = ctx.createLoggerCtx();

      logger.error('test');
      logger.error('test', 'test2');

      expect(ctx.logSpy.mock.calls).toEqual([
        [errorPrefix, 'test'],
        [errorPrefix, 'test', 'test2'],
      ]);

      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('debug', () => {
    const debugPrefix = [LOG_PREFIX, text.red('DBG')];

    it('Outputs text when debug flag is true', () => {
      const { logger, cli } = ctx.createLoggerCtx();

      // Simulate using the debug option
      cli.debug = true;

      logger.debug('test');
      logger.debug('test', 'test2');

      const result1 = [...debugPrefix, 'test'].join(' ');

      expect(ctx.logSpy.mock.calls).toEqual([
        [result1],
        [result1, 'test2'],
      ]);
    });
  });
});

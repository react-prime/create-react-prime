/* eslint-disable no-console */
import 'reflect-metadata';
import color from 'kleur';

import { LOG_PREFIX } from 'core/constants';
import Logger from 'core/utils/Logger';

import mockConsole from './utils/mockConsole';
import createCliCtx from './utils/createCliCtx';

describe('Logger', () => {
  const restoreConsole = mockConsole();

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
    const warningPrefix = [LOG_PREFIX, color.yellow('WRN')];

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
    const errorPrefix = [LOG_PREFIX, color.red('ERR!') + ' Installation aborted.'];
    const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

    it('Logs error text with an error prefix and exits with code 1', () => {
      const { logger } = ctx.createLoggerCtx();

      logger.error('test');
      logger.error('test', 'test2');

      const result1 = [...errorPrefix, 'test'].join(' ');

      expect(ctx.logSpy.mock.calls).toEqual([
        [result1],
        [result1, 'test2'],
      ]);

      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('debug', () => {
    const debugPrefix = [LOG_PREFIX, color.red('DBG')];

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

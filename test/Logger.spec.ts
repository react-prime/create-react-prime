import 'reflect-metadata';
import * as i from 'types';
import { Container } from 'inversify';
import SERVICES from 'ioc/services';
import { prepareContainer } from 'ioc/container';
import { LOG_PREFIX, TEXT } from 'src/constants';

describe('Logger', () => {
  let logSpy: jest.SpyInstance<void, [string?, ...string[]]>;
  let container: Container;
  let logger: i.LoggerType;

  beforeAll(async () => {
    container = await prepareContainer();
  });

  beforeEach(() => {
    logger = container.get(SERVICES.Logger);

    logSpy = jest.spyOn(console, 'log');
    logSpy.mockClear();
  });

  describe('warning', () => {
    const warningPrefix = `${LOG_PREFIX} ${TEXT.YELLOW}WARNING${TEXT.DEFAULT}`;

    it('Logs text with a warning prefix', () => {
      logger.warning('test');
      logger.warning('test', 'test2');

      expect(logSpy.mock.calls).toEqual([
        [warningPrefix, 'test'],
        [warningPrefix, 'test', 'test2'],
      ]);
    });
  });

  describe('error', () => {
    const errorPrefix = [`${LOG_PREFIX} ${TEXT.RED}ERR!${TEXT.DEFAULT}`, 'Installation aborted.'];
    const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

    it('Logs error text with an error prefix and exits with code 1', () => {
      logger.error('test');
      logger.error('test', 'test2');

      expect(logSpy.mock.calls).toEqual([
        [...errorPrefix, 'test'],
        [...errorPrefix, 'test', 'test2'],
      ]);

      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('debug', () => {
    const debugPrefix = `${LOG_PREFIX} ${TEXT.RED}DEBUG${TEXT.DEFAULT}`;

    it('Does not output text when debug flag is false', async () => {
      expect.assertions(1);

      logger.debug('test');
      logger.debug('test', 'test2');

      expect(logSpy.mock.calls).toEqual([]);
    });

    it('Outputs text when debug flag is true', async () => {
      expect.assertions(1);

      // Simulate using the debug option
      process.argv.push('-d');

      // Rebuild container with new flags
      container = await prepareContainer();

      logger.debug('test');
      logger.debug('test', 'test2');

      expect(logSpy.mock.calls).toEqual([
        [debugPrefix, 'test'],
        [debugPrefix, 'test', 'test2'],
      ]);
    });
  });
});

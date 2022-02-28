/* eslint-disable no-console */
import { fn, spyOn } from 'vitest';
import color from 'kleur';
import { logger } from '@crp/utils';
import { LOG_PREFIX } from '@crp/constants';


// Supress console.log output from tests
const orgLog = console.log;

function mockConsole(): () => void {
  console.log = fn();

  return function restoreConsole() {
    console.log = orgLog;
  };
}


describe('Logger', () => {
  const restoreConsole = mockConsole();
  const logSpy = spyOn(console, 'log');

  beforeEach(() => {
    logSpy.mockClear();
  });

  afterAll(() => {
    restoreConsole();
  });

  describe('msg', () => {
    const prefix = [LOG_PREFIX, '⚡️'];

    it('Logs text with prefix', () => {
      logger.msg('test');
      logger.msg('test', 'test2');

      const result1 = [[...prefix, 'test'].join(' ')];
      const result2 = [[...prefix, 'test'].join(' '), 'test2'];

      expect(logSpy.mock.calls).toEqual([
        result1,
        result2,
      ]);
    });
  });

  describe('warning', () => {
    const warningPrefix = [LOG_PREFIX, color.yellow('WRN')];

    it('Logs text with a warning prefix', () => {
      logger.warning('test');
      logger.warning('test', 'test2');

      const result1 = [[...warningPrefix, 'test'].join(' ')];
      const result2 = [[...warningPrefix, 'test'].join(' '), 'test2'];

      expect(logSpy.mock.calls).toEqual([
        result1,
        result2,
      ]);
    });
  });

  describe('error', () => {
    const errorPrefix = [LOG_PREFIX, color.red('ERR!') + ' Installation aborted:'];
    // @ts-ignore
    const mockProcessExit = spyOn(process, 'exit').mockImplementation(() => void {});

    it('Logs error text with an error prefix and exits with code 1', () => {
      logger.error('test');
      logger.error('test', 'test2');

      const result1 = [[...errorPrefix, 'test'].join(' ')];
      const result2 = [[...errorPrefix, 'test'].join(' '), 'test2'];

      expect(logSpy.mock.calls).toEqual([
        result1,
        result2,
      ]);

      expect(mockProcessExit).toHaveBeenCalledWith(1);

      mockProcessExit.mockClear();
    });
  });

  describe('whitespace', () => {
    it('Logs whitespace', () => {
      logger.whitespace();

      expect(logSpy.mock.calls).toEqual([[]]);
    });
  });
});

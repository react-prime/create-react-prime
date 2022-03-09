/* eslint-disable no-console */
import { cli } from '@crp';
import { logger } from '@crp/utils';
import { LOG_PREFIX } from '@crp/constants';

// Supress console.log output from tests
const orgLog = console.log;

function mockConsole(): () => void {
  console.log = vi.fn();

  return function restoreConsole() {
    console.log = orgLog;
  };
}

describe('Logger', () => {
  const restoreConsole = mockConsole();
  const logSpy = vi.spyOn(console, 'log');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    restoreConsole();
  });

  describe('msg', () => {
    const prefix = [`\n${LOG_PREFIX}`, '⚡️'];

    it('Logs text with prefix', () => {
      logger.msg('test');
      const result = [[...prefix, 'test'].join(' ')];

      expect(logSpy.mock.calls[0]).toEqual(result);
    });

    it('Logs text with prefix and args', () => {
      logger.msg('test', 'test2');
      const result = [[...prefix, 'test'].join(' '), 'test2'];

      expect(logSpy.mock.calls[0]).toEqual(result);
    });
  });

  describe('warning', () => {
    const warningPrefix = [`\n${LOG_PREFIX}`, logger.warningMsg];

    it('Logs text with a warning prefix', () => {
      logger.warning('test');
      const result = [[...warningPrefix, 'test'].join(' ')];

      expect(logSpy.mock.calls[0]).toEqual(result);
    });

    it('Logs text with prefix and args', () => {
      logger.warning('test', 'test2');
      const result = [[...warningPrefix, 'test'].join(' '), 'test2'];

      expect(logSpy.mock.calls[0]).toEqual(result);
    });
  });

  describe('error', () => {
    const errorPrefix = [`\n${LOG_PREFIX}`, logger.errorMsg];
    const mockProcessExit = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => 0 as never);

    it('Logs error text with an error prefix and exits with code 1', async () => {
      const result = [[...errorPrefix, 'test'].join(' ')];

      await logger.error('test');

      expect(logSpy.mock.calls[0]).toEqual(result);
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    it('Shows the error stack when debug is enabled', async () => {
      vi.spyOn(cli.command, 'opts').mockReturnValueOnce({ debug: true });
      const traceSpy = vi
        .spyOn(console, 'trace')
        .mockImplementationOnce(() => void {});

      await logger.error();

      expect(traceSpy).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('whitespace', () => {
    it('Logs whitespace', () => {
      logger.whitespace();

      expect(logSpy.mock.calls).toEqual([[]]);
    });
  });
});

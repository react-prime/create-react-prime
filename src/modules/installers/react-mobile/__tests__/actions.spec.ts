import { state, logger } from '@crp';
import * as crpUtils from '@crp/utils';

import { renameFiles, renameProject, validateProjectName } from '../actions';

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
  })),
}));

describe('react-mobile actions', () => {
  const whitespaceMock = vi
    .spyOn(logger, 'whitespace')
    .mockImplementation(() => void 0);

  afterAll(() => {
    whitespaceMock.mockRestore();
  });

  describe('validateProjectName', () => {
    it('Correctly validates project names', () => {
      state.answers.projectName = 'foo';
      expect(validateProjectName()).toBe(true);
      state.answers.projectName = 'foo1';
      expect(validateProjectName()).toBe(true);
      state.answers.projectName = '1foo';
      expect(validateProjectName()).toBe(true);
      state.answers.projectName = 'foo_bar';
      expect(validateProjectName()).toBe(false);
      state.answers.projectName = 'foo-bar';
      expect(validateProjectName()).toBe(false);
    });
  });

  describe('renameProject', () => {
    it('Correctly renames the project name with no special chars and lower case', () => {
      state.answers.projectName = 'foo-bar';
      renameProject();

      expect(state.answers.projectName).toBe('foobar');
    });

    it('Shows a warning message that the project was renamed', () => {
      const warningSpy = vi
        .spyOn(logger, 'warning')
        .mockImplementation(() => void 0);
      state.answers.projectName = 'foo-bar';
      renameProject();

      expect(warningSpy).toHaveBeenCalled();
    });
  });

  describe('renameFiles', () => {
    const execAsyncSpy = vi
      .spyOn(crpUtils, 'asyncExec')
      .mockResolvedValue({} as any);
    const warningSpy = vi
      .spyOn(logger, 'warning')
      .mockImplementation(() => void 0);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('Creates a spinner', async () => {
      const spinnerSpy = vi
        .spyOn(crpUtils, 'createSpinner')
        .mockImplementationOnce(() => {
          return {
            start: () => Promise.resolve(),
          } as any;
        });

      await renameFiles();

      expect(spinnerSpy).toHaveBeenCalled();
    });

    it('Runs through the scripts', async () => {
      await renameFiles();

      expect(execAsyncSpy).toHaveBeenCalledTimes(3);
      expect(warningSpy).not.toHaveBeenCalled();
    });

    it('Shows a warning when a script fails', async () => {
      const execAsyncFailSpy = execAsyncSpy.mockRejectedValueOnce(new Error());
      const warningSpy = vi
        .spyOn(logger, 'warning')
        .mockImplementation(() => void 0);

      await renameFiles();

      expect(execAsyncFailSpy).toHaveBeenCalledTimes(3);
      expect(warningSpy).toHaveBeenCalledOnce();
    });
  });
});

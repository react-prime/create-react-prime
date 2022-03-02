import { state, logger } from '@crp';
import * as crpUtils from '@crp/utils';

import { renameFiles, action, renameProject, validateProjectName } from '../actions';


describe('react-mobile actions', () => {
  const whitespaceMock = vi.spyOn(logger, 'whitespace').mockImplementation(() => void 0);

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
    it('Correctly renames the project name with camelCase', () => {
      state.answers.projectName = 'foo-bar';
      renameProject();

      expect(state.answers.projectName).toBe('fooBar');
    });

    it('Shows a warning message that the project was renamed', () => {
      const warningSpy = vi.spyOn(logger, 'warning').mockImplementation(() => void 0);
      state.answers.projectName = 'foo-bar';
      renameProject();

      expect(warningSpy).toHaveBeenCalled();
    });
  });

  describe('renameFiles', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const execAsyncSpy = vi.spyOn(crpUtils, 'asyncExec').mockResolvedValue({} as any);
    const warningSpy = vi.spyOn(logger, 'warning').mockImplementation(() => void 0);

    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('Creates a spinner', async () => {
      const spinnerSpy = vi.spyOn(crpUtils, 'createSpinner')
        .mockImplementationOnce(() => ({
          start: () => Promise.resolve(),
        } as any)); // eslint-disable-line @typescript-eslint/no-explicit-any

      await renameFiles();

      expect(spinnerSpy).toHaveBeenCalled();
    });

    it('Runs through the scripts', async () => {
      await action();

      expect(execAsyncSpy).toHaveBeenCalledTimes(3);
      expect(warningSpy).not.toHaveBeenCalled();
    });

    it('Shows a warning when a script fails', async () => {
      const execAsyncFailSpy = execAsyncSpy.mockRejectedValueOnce(new Error());
      const warningSpy = vi.spyOn(logger, 'warning').mockImplementation(() => void 0);

      await action();

      expect(execAsyncFailSpy).toHaveBeenCalledTimes(3);
      expect(warningSpy).toHaveBeenCalledOnce();
    });
  });
});

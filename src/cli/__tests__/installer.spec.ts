import type { SpyInstance } from 'vitest';
import { spyOn } from 'vitest';
import { cli, logger, state } from '@crp';
import { CLI_ARGS, ERROR_TEXT } from '@crp/constants';

import * as question from '../../modules/questions';
import { installerEntry } from '../actions/installer';
// import * as installerEntryUtils from '../actions/installer';


vi.mock('src/modules/installers', () => ({
  'reactWebInstaller': {
    default: vi.fn(),
  },
  'failInstaller': {
    default: vi.fn().mockRejectedValue(''),
  },
}));


describe('Installer', () => {
  let boilerplateSpy: SpyInstance<[], Promise<string>>;
  let projectNameSpy: SpyInstance<[projectName: string], Promise<string>>;
  let errorSpy: SpyInstance<[...args: string[]], never>;

  beforeEach(() => {
    boilerplateSpy = spyOn(question, 'boilerplate').mockResolvedValueOnce('react-web');
    projectNameSpy = spyOn(question, 'projectName').mockResolvedValueOnce('bar');
    errorSpy = spyOn(logger, 'error').mockImplementationOnce(() => void 0 as never);
  });

  it('Prompts boilerplate and project name questions', async () => {
    await installerEntry();

    expect(boilerplateSpy).toHaveBeenCalled();
    expect(projectNameSpy).toHaveBeenCalled();
    expect(projectNameSpy).toHaveBeenCalledWith('react-web');
    expect(state.answers.boilerplate).toBe('react-web');
    expect(state.answers.projectName).toBe('bar');
  });

  it('Uses the CLI argument as project name', async () => {
    cli.args[CLI_ARGS.ProjectName] = 'foo';

    await installerEntry();

    expect(state.answers.projectName).toBe('foo');
  });

  /** @TODO Can't get this to track if the mock fn is called */
  // it('Runs the installer when found', async () => {
  //   const mockInstaller = vi.fn(() => Promise.resolve());
  //   spyOn(installerEntryUtils, 'getInstaller').mockReturnValue(() => void 0);

  //   await installerEntry();

  //   expect(mockInstaller.mock.calls.length).toBe(1);
  // });

  it('Errors when installer is not found', async () => {
    boilerplateSpy = spyOn(question, 'boilerplate').mockResolvedValueOnce('foo');

    await installerEntry();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(ERROR_TEXT.InstallerNotFound, 'foo');
  });

  it('Throws a generic error when something goes wrong during execution', async () => {
    spyOn(question, 'boilerplate').mockResolvedValueOnce('fail');
    const errorSpy = spyOn(logger, 'error').mockImplementationOnce(() => void 0 as never);

    await installerEntry();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(ERROR_TEXT.GenericError, 'fail');
  });
});

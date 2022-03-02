import type { SpyInstance } from 'vitest';
import type { AnyArr } from '@crp/types';
import { spyOn } from 'vitest';
import { cli, installersMap, logger, state } from '@crp';
import { CLI_ARGS, ERROR_TEXT } from '@crp/constants';

import * as question from '../../modules/questions';
import installerEntry from '../actions/installer';


describe('Installer', () => {
  let boilerplateSpy: SpyInstance<AnyArr, Promise<string>>;
  let projectNameSpy: SpyInstance<[projectName: string], Promise<string>>;
  let installerSpy: SpyInstance<[key: string], (() => Promise<void>) | undefined>;
  let errorSpy: SpyInstance<AnyArr, never>;

  beforeEach(() => {
    boilerplateSpy = spyOn(question, 'boilerplate').mockResolvedValueOnce('react-web');
    projectNameSpy = spyOn(question, 'projectName').mockResolvedValueOnce('bar');
    installerSpy = spyOn(installersMap, 'get').mockReturnValueOnce(() => Promise.resolve());
    errorSpy = spyOn(logger, 'error').mockImplementationOnce(() => void 0 as never);
  });

  it('Prompts boilerplate and project name questions', async () => {
    await installerEntry();

    expect(boilerplateSpy).toHaveBeenCalled();
    expect(projectNameSpy).toHaveBeenCalled();
    expect(projectNameSpy).toHaveBeenCalledWith('react-web');
    expect(state.answers.boilerplate).toBe('react-web');
    expect(state.answers.projectName).toBe('bar');
    expect(installerSpy).toHaveBeenCalled();
  });

  it('Uses the CLI argument as project name', async () => {
    cli.args[CLI_ARGS.ProjectName] = 'foo';

    await installerEntry();

    expect(state.answers.projectName).toBe('foo');
  });

  it('Errors when installer is not found', async () => {
    spyOn(installersMap, 'get').mockReturnValueOnce(undefined);

    await installerEntry();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(ERROR_TEXT.InstallerNotFound, 'react-web');
  });

  it('Throws a generic error when something goes wrong during execution', async () => {
    spyOn(installersMap, 'get').mockReturnValueOnce(() => Promise.reject());
    const errorSpy = spyOn(logger, 'error').mockImplementationOnce(() => void 0 as never);

    await installerEntry();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(ERROR_TEXT.GenericError, 'react-web');
  });
});

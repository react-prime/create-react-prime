import path from 'path';
import fs from 'fs';
import type { PackageJson } from 'type-fest';
import tempy from 'tempy';
import { logger, state } from '@crp';
import { ERROR_TEXT } from '@crp/constants';
import * as utils from '@crp/utils';

import { cleanup, clone, npmInstall, npmPackageUpdate } from '../actions';


vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
  })),
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('shared actions', () => {
  const boilerplate = 'react-web';
  const projectName = 'foo';
  const loggerErrorSpy = vi.spyOn(logger, 'error').mockImplementation(() => void 0 as never);
  const execSpy = vi.spyOn(utils, 'asyncExec').mockResolvedValue({} as any);
  vi.spyOn(logger, 'whitespace').mockImplementation(() => void 0);

  beforeAll(() => {
    state.answers.boilerplate = boilerplate;
    state.answers.projectName = projectName;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    // @ts-ignore
    delete state.answers.boilerplate;
    // @ts-ignore
    delete state.answers.projectName;

    vi.restoreAllMocks();
  });

  describe('clone', () => {
    it('Checks if the directory already exists', async () => {
      const existsSpy = vi.spyOn(utils, 'asyncExists').mockResolvedValueOnce(true);

      await clone('github.com/url');

      expect(existsSpy).toHaveBeenCalledWith(projectName);
      expect(loggerErrorSpy).toHaveBeenCalledWith(ERROR_TEXT.DirectoryExists, projectName);
    });

    it('Runs the exec script', async () => {
      vi.spyOn(utils, 'asyncExists').mockResolvedValueOnce(false);


      await clone('github.com/url');

      expect(loggerErrorSpy).not.toHaveBeenCalled();
      expect(execSpy).toHaveBeenCalledWith(`git clone github.com/url ${projectName}`);
    });
  });

  describe('npmInstall', () => {
    it('Runs the exec script', async () => {
      await npmInstall();

      expect(execSpy).toHaveBeenCalledWith(`npm --prefix ${projectName} install`);
    });
  });

  describe('npmPackageUpdate', () => {
    // Mock a package.json file
    const mockPackageJson = tempy.file();
    fs.writeFileSync(mockPackageJson, JSON.stringify({}));
    // Mock the path to the mock package.json file
    vi.spyOn(path, 'resolve').mockReturnValue(mockPackageJson);

    it('Updates the package.json file with the correct data', async () => {
      await npmPackageUpdate();

      const raw = fs.readFileSync(mockPackageJson, 'utf8');
      const parsed = JSON.parse(raw) as PackageJson;

      expect(raw).to.not.equal(JSON.stringify({}));
      expect(parsed.name).toEqual(projectName);
      expect(parsed.description).toEqual(`Repository of ${projectName}`);
      expect(parsed.version).toEqual('0.1.0');
      expect(parsed.private).toEqual(true);
      // All other fields are not important enough to test
    });

    it('Exits with error if package.json can not be found', async () => {
      vi.spyOn(path, 'resolve').mockReturnValueOnce('invalid/path/package.json');

      await npmPackageUpdate();

      expect(loggerErrorSpy).toHaveBeenCalledWith(ERROR_TEXT.PkgNotFound, 'invalid/path/package.json');
    });
  });

  describe('cleanup', () => {
    it('Runs the exec script', async () => {
      await cleanup();

      expect(execSpy).toHaveBeenCalledWith(`rm -rf ${projectName}/.git ${projectName}/.travis.yml`);
    });
  });
});
/* eslint-enable */

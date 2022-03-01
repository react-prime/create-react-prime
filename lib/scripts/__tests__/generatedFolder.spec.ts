import path from 'path';
import fs from 'fs';
import { type SpyInstance, spyOn } from 'vitest';

import { getGeneratedFolder } from '../utils/generatedFolder';


describe('generatedFolder', () => {
  const TEST_PATH = '/test';
  let mockResolve: SpyInstance<string[], string>;

  beforeAll(() => {
    mockResolve = spyOn(path, 'resolve').mockImplementation(() => TEST_PATH);
  });

  afterAll(() => {
    mockResolve.mockRestore();
  });

  it('Returns the path if it exists', () => {
    spyOn(fs, 'existsSync').mockImplementationOnce(() => true);

    expect(getGeneratedFolder()).toEqual(TEST_PATH);
  });

  it('Generates the folder if it does not exist yet', () => {
    spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    const mkdirMock = spyOn(fs, 'mkdirSync').mockImplementationOnce(() => void {});

    getGeneratedFolder();

    expect(mkdirMock).toBeCalled();
  });
});

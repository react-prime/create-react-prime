import fs from 'fs';
import { spyOn, type SpyInstance } from 'vitest';

import { generateModulesArray } from '../generateModulesArray';


describe('generateModulesArray', () => {
  let mockReaddirSync: SpyInstance<[path: fs.PathLike, options: fs.ObjectEncodingOptions & {
    withFileTypes: true;
  }], fs.Dirent[]>;

  beforeAll(() => {
    mockReaddirSync = spyOn(fs, 'readdirSync').mockImplementationOnce(() => [{
      isDirectory: () => true,
      name: 'boilerplate1',
    } as fs.Dirent,
    {
      isDirectory: () => true,
      name: 'boilerplate2',
    } as fs.Dirent,
    {
      isDirectory: () => true,
      name: 'shared',
    } as fs.Dirent,
    {
      isDirectory: () => false,
      name: 'index.ts',
    } as fs.Dirent]);
  });

  afterAll(() => {
    mockReaddirSync.mockRestore();
  });

  it('Returns an array of filtered folder names', () => {
    const { modules } = generateModulesArray();
    expect(modules).toEqual(['boilerplate1', 'boilerplate2']);
  });
});

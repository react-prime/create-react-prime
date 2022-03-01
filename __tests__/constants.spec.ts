import os from 'os';
import { spyOn } from 'vitest';


describe('constants', () => {
  it('Returns a valid .crp.json path', async () => {
    spyOn(os, 'homedir').mockImplementationOnce(() => '/foo/bar');
    const { SETTINGS_FILE_PATH } = await import('@crp/constants');

    expect(SETTINGS_FILE_PATH).toBe('/foo/bar/.crp.json');
  });
});

import os from 'os';

describe('constants', () => {
  it('Returns a valid .crp.json path', async () => {
    vi.spyOn(os, 'homedir').mockImplementationOnce(() => '/foo/bar');
    const { SETTINGS_FILE_PATH } = await import('@crp/constants');

    expect(SETTINGS_FILE_PATH).toBe('/foo/bar/.crp.json');
  });
});

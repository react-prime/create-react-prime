import 'reflect-metadata';
import createCliCtx from './utils/createCliCtx';

describe('CLIMgr', () => {
  describe('installType', () => {
    it('Returns to correct install type', () => {
      const { cli, cliMgr } = createCliCtx();

      // Default type
      expect(cliMgr.installType).toEqual('client');

      cli.type = 'client';
      expect(cliMgr.installType).toEqual('client');

      cli.type = 'ssr';
      expect(cliMgr.installType).toEqual('ssr');

      cli.type = 'native';
      expect(cliMgr.installType).toEqual('native');
    });
  });

  describe('installRepository', () => {
    it('Returns the correct repository name', () => {
      const { cli, cliMgr } = createCliCtx();

      // Default
      expect(cliMgr.installRepository).toEqual('react-prime');

      cli.type = 'client';
      expect(cliMgr.installRepository).toEqual('react-prime');

      cli.type = 'ssr';
      expect(cliMgr.installRepository).toEqual('react-prime-ssr');

      cli.type = 'native';
      expect(cliMgr.installRepository).toEqual('react-prime-native');
    });
  });

  describe('projectName', () => {
    it('Returns the repository name if no name is given', () => {
      const { cli, cliMgr } = createCliCtx();

      // Default
      expect(cliMgr.projectName).toEqual('react-prime');

      cli.type = 'client';
      expect(cliMgr.projectName).toEqual('react-prime');

      cli.type = 'ssr';
      expect(cliMgr.projectName).toEqual('react-prime-ssr');

      cli.type = 'native';
      expect(cliMgr.projectName).toEqual('react-prime-native');
    });

    it('Returns the new project name after setting it', () => {
      const { cliMgr } = createCliCtx();

      cliMgr.projectName = 'test';

      expect(cliMgr.projectName).toEqual('test');
    });
  });

  describe('isDebugging', () => {
    it('Returns the correct debug option value', () => {
      const { cli, cliMgr } = createCliCtx();

      expect(cliMgr.isDebugging).toBeUndefined();

      cli.debug = true;
      expect(cliMgr.isDebugging).toEqual(true);
    });
  });

  describe('skipSteps', () => {
    it('Returns the given steps', () => {
      const { cli, cliMgr } = createCliCtx();

      expect(cliMgr.skipSteps).toBeUndefined();

      cli.skipSteps = ['CLONE'];
      expect(cliMgr.skipSteps).toEqual(['CLONE']);

      cli.skipSteps = ['CLONE', 'NPM_INSTALL'];
      expect(cliMgr.skipSteps).toEqual(['CLONE', 'NPM_INSTALL']);
    });
  });
});

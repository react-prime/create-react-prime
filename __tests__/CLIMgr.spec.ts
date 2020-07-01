import 'reflect-metadata';
import CLIMgr from 'src/CLIMgr';
import cli from 'src/CLI';

describe('CLIMgr', () => {
  const ctx = new class Ctx {
    get cliMgr() { return new CLIMgr(cli); }
  };

  describe('installType', () => {
    it('Returns to correct install type', () => {
      // Default type
      expect(ctx.cliMgr.installType).toEqual('client');

      expect(ctx.cliMgr.installType).toEqual('client');

      cli.type = 'ssr';
      expect(ctx.cliMgr.installType).toEqual('ssr');

      cli.type = 'native';
      expect(ctx.cliMgr.installType).toEqual('native');
    });
  });

  describe('installRepository', () => {
    it('Returns the correct repository name', () => {
      // Default
      const cliMgr = ctx.cliMgr;
      jest.spyOn(cliMgr, 'installType', 'get').mockReturnValue('client');
      expect(cliMgr.installRepository).toEqual('react-prime');

      cli.type = 'client';
      expect(ctx.cliMgr.installRepository).toEqual('react-prime');

      cli.type = 'ssr';
      expect(ctx.cliMgr.installRepository).toEqual('react-prime-ssr');

      cli.type = 'native';
      expect(ctx.cliMgr.installRepository).toEqual('react-prime-native');
    });
  });

  describe('projectName', () => {
    it('Returns the repository name if no name is given', () => {
      // Default
      const cliMgr = ctx.cliMgr;
      jest.spyOn(cliMgr, 'installType', 'get').mockReturnValue('client');
      expect(cliMgr.projectName).toEqual('react-prime');

      cli.type = 'client';
      expect(ctx.cliMgr.projectName).toEqual('react-prime');

      cli.type = 'ssr';
      expect(ctx.cliMgr.projectName).toEqual('react-prime-ssr');

      cli.type = 'native';
      expect(ctx.cliMgr.projectName).toEqual('react-prime-native');
    });

    it('Returns the new project name after setting it', () => {
      const cliMgr = ctx.cliMgr;
      cliMgr.projectName = 'test';

      expect(cliMgr.projectName).toEqual('test');
    });
  });

  describe('isDebugging', () => {
    it('Returns the correct debug option value', () => {
      expect(ctx.cliMgr.isDebugging).toBeUndefined();

      cli.debug = true;
      expect(ctx.cliMgr.isDebugging).toEqual(true);
    });
  });

  describe('skipSteps', () => {
    it('Returns the given steps', () => {
      expect(ctx.cliMgr.skipSteps).toBeUndefined();

      cli.skipSteps = ['CLONE'];
      expect(ctx.cliMgr.skipSteps).toEqual(['CLONE']);

      cli.skipSteps = ['CLONE', 'NPM_INSTALL'];
      expect(ctx.cliMgr.skipSteps).toEqual(['CLONE', 'NPM_INSTALL']);
    });
  });
});

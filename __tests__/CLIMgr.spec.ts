import 'reflect-metadata';

import createCliCtx from './utils/createCliCtx';


describe('CLIMgr', () => {
  describe('installBoilerplate', () => {
    it('Returns to chosen boilerplate', () => {
      const { cli, cliMgr } = createCliCtx();

      cli.boilerplate = 'client';
      expect(cliMgr.boilerplateTypeName).toEqual('client');

      cli.boilerplate = 'ssr';
      expect(cliMgr.boilerplateTypeName).toEqual('ssr');

      cli.boilerplate = 'native';
      expect(cliMgr.boilerplateTypeName).toEqual('native');
    });
  });

  describe('projectName', () => {
    it('Returns the new project name after setting it', () => {
      const { cliMgr } = createCliCtx();

      cliMgr.projectName = 'test';

      expect(cliMgr.projectName).toEqual('test');
    });
  });

  describe('isDebugging', () => {
    it('Returns the chosen debug option value', () => {
      const { cli, cliMgr } = createCliCtx();

      expect(cliMgr.isDebugging).toEqual(false);

      cli.debug = true;
      expect(cliMgr.isDebugging).toEqual(true);
    });
  });

  describe('skipSteps', () => {
    it('Returns the given steps', () => {
      const { cli, cliMgr } = createCliCtx();

      expect(cliMgr.skipSteps).toHaveLength(0);

      cli.skipSteps = ['CLONE'];
      expect(cliMgr.skipSteps).toEqual(['CLONE']);

      cli.skipSteps = ['CLONE', 'NPM_INSTALL'];
      expect(cliMgr.skipSteps).toEqual(['CLONE', 'NPM_INSTALL']);
    });
  });
});

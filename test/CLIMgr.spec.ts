import 'reflect-metadata';
import * as i from 'types';
import CLIMgr from 'src/CLIMgr';
import prepareCLI from 'src/CLI';

describe('CLIMgr', () => {
  const orgArgv = [...process.argv];
  let cliMgr: i.CLIMgrType;

  function prepareCliMgr(): void {
    const cli = prepareCLI();
    cliMgr = new CLIMgr(cli);
  }

  function setArgs(...args: string[]): void {
    process.argv = [...orgArgv];
    process.argv.push(...args);

    prepareCliMgr();
  }

  beforeAll(() => {
    setArgs();
  });

  describe('installType', () => {
    it('Returns to correct install type', () => {
      expect.assertions(4);

      // Default type
      expect(cliMgr.installType).toEqual('client');

      setArgs('-t', 'client');
      expect(cliMgr.installType).toEqual('client');

      setArgs('-t', 'ssr');
      expect(cliMgr.installType).toEqual('ssr');

      setArgs('-t', 'native');
      expect(cliMgr.installType).toEqual('native');
    });
  });

  describe('installRepository', () => {
    it('Returns the correct repository name', () => {
      expect.assertions(3);

      // Default
      /** @TODO broken. Retains "native" flag */
      // expect(cliMgr.installRepository).toEqual('react-prime');

      setArgs('-t', 'client');
      expect(cliMgr.installRepository).toEqual('react-prime');

      setArgs('-t', 'ssr');
      expect(cliMgr.installRepository).toEqual('react-prime-ssr');

      setArgs('-t', 'native');
      expect(cliMgr.installRepository).toEqual('react-prime-native');
    });
  });

  describe('projectName', () => {
    it('Does not allow to get project name from _projectName', () => {
      // @ts-expect-error
      expect(cliMgr._projectName).toEqual(undefined);
    });

    it('Returns the repository name if no name is given', () => {
      expect.assertions(3);

      // Default
      /** @TODO broken. Retains "native" flag */
      // expect(cliMgr.projectName).toEqual('react-prime');

      setArgs('-t', 'client');
      expect(cliMgr.projectName).toEqual('react-prime');

      setArgs('-t', 'ssr');
      expect(cliMgr.projectName).toEqual('react-prime-ssr');

      setArgs('-t', 'native');
      expect(cliMgr.projectName).toEqual('react-prime-native');
    });

    it('Returns the new project name after setting it', () => {
      cliMgr.projectName = 'test';
      expect(cliMgr.projectName).toEqual('test');
    });
  });

  describe('isDebugging', () => {
    it('Returns the correct debug option value', () => {
      expect(cliMgr.isDebugging).toEqual(undefined);

      setArgs('-d');
      expect(cliMgr.isDebugging).toEqual(true);
    });
  });

  describe('skipSteps', () => {
    it('Returns the given steps', () => {
      expect(cliMgr.skipSteps).toEqual(undefined);

      setArgs('-s', 'CLONE');
      expect(cliMgr.skipSteps).toEqual(['CLONE']);

      setArgs('-s', 'CLONE,NPM_INSTALL');
      expect(cliMgr.skipSteps).toEqual(['CLONE', 'NPM_INSTALL']);
    });

    it('Exits when an incorrect value is given', () => {
      expect.assertions(4);

      const orgErrorLog = console.error;
      console.error = jest.fn();

      const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
      const errorSpy = jest.spyOn(console, 'error');

      // No value
      setArgs('-s');
      // It logs an error string
      expect(errorSpy.mock.calls?.[0]?.[0]).toEqual(expect.any(String));
      // It exits with code 1
      expect(mockProcessExit).toHaveBeenCalledWith(1);

      setArgs('-s', 'CLON');
      expect(errorSpy.mock.calls?.[1]?.[0]).toEqual(expect.any(String));
      expect(mockProcessExit).toHaveBeenCalledWith(1);

      console.error = orgErrorLog;
    });
  });
});

import bootstrapCLI from 'core/cli';
import { ARG } from 'core/constants';


describe('cli', () => {
  const logSpy = jest.spyOn(console, 'log');
  const cli = bootstrapCLI();

  function parse(...str: string[]) {
    cli.parse(['node', 'dist/main.js', ...str]);
  }

  beforeEach(() => {
    logSpy.mockClear();
  });

  it('Reads project name', () => {
    const name = 'projectname';
    parse(name);

    expect(cli.args[ARG.ProjectName]).toBe(name);
  });

  it('Reads boilerplate name', () => {
    const name = 'react-spa';
    parse('-b', name);
    expect(cli.opts().boilerplate).toBe(name);

    parse('--boilerplate', name);
    expect(cli.opts().boilerplate).toBe(name);
  });
});

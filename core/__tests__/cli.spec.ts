import * as i from 'types';
import bootstrapCLI from 'core/cli';
import { ARG } from 'core/constants';


describe('cli', () => {
  const cli = bootstrapCLI();

  // Simulate user input (node dist/main.js doesnt actually do anything here)
  function parse(...str: string[]) {
    cli.parse(['node', 'dist/main.js', ...str]);
  }

  it('Reads project name', () => {
    const name = 'projectname';
    parse(name);

    expect(cli.args[ARG.ProjectName]).toBe(name);
  });

  it('Reads boilerplate name', () => {
    const name = 'react-spa';
    parse('-b', name);
    expect(cli.opts<i.Opts>().boilerplate).toBe(name);

    parse('--boilerplate', name);
    expect(cli.opts<i.Opts>().boilerplate).toBe(name);
  });
});

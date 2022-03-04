import { cli, bootstrapCLI } from '@crp';
import { CLI_ARGS } from '@crp/constants';

describe('CLI', () => {
  beforeAll(() => {
    bootstrapCLI();
  });

  // Simulate user input (node dist/main.js doesnt actually do anything here)
  function parse(...str: string[]) {
    cli.parse(['node', 'dist/main.js', ...str]);
  }

  it('Reads project name', () => {
    const name = 'projectname';
    parse(name);

    expect(cli.args[CLI_ARGS.ProjectName]).toBe(name);
  });

  it('Reads boilerplate flag', () => {
    parse('-b');
    expect(cli.opts().boilerplate).toBeTruthy();

    parse('--boilerplate');
    expect(cli.opts().boilerplate).toBeTruthy();
  });

  it('Reads debug flag', () => {
    parse('-d');
    expect(cli.opts().debug).toBeTruthy();

    parse('--debug');
    expect(cli.opts().debug).toBeTruthy();
  });
});

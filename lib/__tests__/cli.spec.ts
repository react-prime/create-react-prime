import { cli } from '@crp';
import { CLI_ARGS } from '@crp/constants';

describe('CLI', () => {
  beforeAll(() => {
    cli.bootstrap();
  });

  // Simulate user input (node dist/main.js doesnt actually do anything here)
  function parse(...str: string[]) {
    cli.command.parse(['node', 'dist/main.js', ...str]);
  }

  it('Reads project name', () => {
    const name = 'projectname';
    parse(name);

    expect(cli.command.args[CLI_ARGS.ProjectName]).toBe(name);
  });

  it('Reads boilerplate flag', () => {
    parse('-b');
    expect(cli.command.opts().boilerplate).toBeTruthy();

    parse('--boilerplate');
    expect(cli.command.opts().boilerplate).toBeTruthy();
  });

  it('Reads debug flag', () => {
    parse('-d');
    expect(cli.command.opts().debug).toBeTruthy();

    parse('--debug');
    expect(cli.command.opts().debug).toBeTruthy();
  });
});

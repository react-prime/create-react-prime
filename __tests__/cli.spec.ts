import cli, { ARGS, bootstrap } from 'cli';


describe('CLI', () => {
  beforeAll(() => {
    bootstrap();
  });

  // Simulate user input (node dist/main.js doesnt actually do anything here)
  function parse(...str: string[]) {
    cli.parse(['node', 'dist/main.js', ...str]);
  }

  it('Reads project name', () => {
    const name = 'projectname';
    parse(name);

    expect(cli.args[ARGS.ProjectName]).toBe(name);
  });

  it('Reads boilerplate name', () => {
    const name = 'react-web';
    parse('-b', name);
    expect(cli.opts().boilerplate).toBe(name);

    parse('--boilerplate', name);
    expect(cli.opts().boilerplate).toBe(name);
  });
});

import cliMgr, { cliAPI__DO_NOT_USE__ } from 'core/CLIMgr';


describe('CLIMgr', () => {
  // Simulate user input (node dist/main.js doesnt actually do anything here)
  function parse(...str: string[]) {
    cliAPI__DO_NOT_USE__.parse(['node', 'dist/main.js', ...str]);
  }

  it('Returns the correct project name', () => {
    const name = 'projectname';
    parse(name);

    expect(cliMgr.getProjectName()).toBe(name);
  });

  it('Returns the correct boilerplate', () => {
    const bp = 'react-spa';

    parse('-b', bp);
    expect(cliMgr.getBoilerplate()).toBe(bp);

    parse('--boilerplate', bp);
    expect(cliMgr.getBoilerplate()).toBe(bp);
  });

  it('Sets the project name correctly', () => {
    const name = 'projectname';
    cliMgr.setProjectName(name);

    expect(cliMgr.getProjectName()).toBe(name);
  });

  it('Sets the boilerplate correctly', () => {
    const bp = 'react-spa';
    cliMgr.setBoilerplate(bp);

    expect(cliMgr.getBoilerplate()).toBe(bp);
  });
});

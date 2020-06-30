import 'reflect-metadata';
import fs from 'fs';
import program from 'commander';
import { mocked } from 'ts-jest/utils';
import App from 'src/App';
import Installer from 'installers/Installer';
import CLIMgr from 'src/CLIMgr';
import Logger from 'src/Logger';

// Mock so it doesn't run a full installation
Installer.prototype.install = jest.fn().mockImplementation(async () => {
  return Promise.resolve();
});

// Mock user given install type
Object.defineProperty(CLIMgr, 'installType', {
  get: jest.fn(() => 'client'),
});

describe('App', () => {
  const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

  class Ctx {
    get cliMgr() { return new CLIMgr(program); }
    get logger() { return mocked(Logger).prototype; }
    get app() { return new App(this.cliMgr, this.logger); }
  }

  const ctx = new Ctx();

  /* eslint-disable no-console */
  const orgLog = console.log;

  beforeAll(() => {
    // Supress console.log output from tests
    console.log = jest.fn();
  });

  beforeEach(() => {
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    console.log = orgLog;
  });
  /* eslint-enable */

  it('Starts and exits the installation process succesfully', async () => {

    // Mock return value of installType, normally given by user
    jest.spyOn(ctx.cliMgr, 'installType', 'get').mockReturnValue('client');

    await ctx.app.start();

    // Exit without code
    expect(mockProcessExit).toHaveBeenCalledWith();
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
  });

  it('Stops the installation when a directory with the same name exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(ctx.logger, 'error');

    await ctx.app.start();

    expect(fs.existsSync).toHaveReturnedWith(true);
    expect(ctx.logger.error).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
  });
});

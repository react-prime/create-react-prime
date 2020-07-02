import 'reflect-metadata';
import fs from 'fs';
import App from 'src/App';
import Installer from 'installers/Installer';
import CLIMgr from 'src/CLIMgr';
import Logger from 'src/Logger';
import mockConsole from './utils/mockConsole';
import createCliCtx from './utils/createCliCtx';

// Mock so it doesn't run a full installation
Installer.prototype.install = jest.fn().mockResolvedValue({});

// Mock user given install type
Object.defineProperty(CLIMgr, 'installType', {
  get: jest.fn().mockReturnValue('client'),
});

describe('App', () => {
  const restoreConsole = mockConsole();
  const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

  const ctx = new class Ctx {
    createAppCtx() {
      const { cliMgr } = createCliCtx();
      const logger = new Logger(cliMgr);

      return {
        cliMgr,
        logger,
        app: new App(cliMgr, logger),
      };
    }
  };

  beforeEach(() => {
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    restoreConsole();
  });

  it('Starts and exits the installation process succesfully', async () => {
    const { app, cliMgr } = ctx.createAppCtx();

    // Mock return value of installType, normally given by user
    jest.spyOn(cliMgr, 'installType', 'get').mockReturnValue('client');

    await app.start();

    // Exit without code
    expect(mockProcessExit).toHaveBeenCalledWith();
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
  });

  it('Stops the installation when a directory with the same name exists', async () => {
    const { app, logger } = ctx.createAppCtx();

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(logger, 'error');

    await app.start();

    expect(fs.existsSync).toHaveReturnedWith(true);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
  });
});

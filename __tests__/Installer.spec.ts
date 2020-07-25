/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import * as i from 'types';
import { mocked } from 'ts-jest/utils';
import ora from 'ora';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import Installer from 'core/Installer';
import Logger from 'core/utils/Logger';

import mockConsole from './utils/mockConsole';


// Mock the factory function
jest.mock('ora', () => {
  const mockOra = {
    start: jest.fn(),
    succeed: jest.fn(),
  };

  return jest.fn(() => mockOra);
});

// Mock the install step executions
(Installer.prototype as any).executeStep = jest.fn().mockResolvedValue({});


describe('Installer', () => {
  const restoreConsole = mockConsole();

  /** @TODO Find a way to load installer outside of IoC container */
  const installer = container.getNamed<i.InstallerType>(SERVICES.Installer, 'client');

  // Full-Access installer reference for accessing protected/private properties
  const FAInstaller = installer as any;

  afterAll(() => {
    restoreConsole();
  });

  it('Configures the base install steps on init', () => {
    installer.init();

    expect(FAInstaller.installStepList).toBeDefined();
    expect(FAInstaller.installStepList.length).toBeGreaterThan(0);

    // Transform strings to methods references
    expect(FAInstaller.installStepList[1].fn).not.toEqual(expect.any(String));
    expect(FAInstaller.installStepList[1].fn).toEqual(expect.any(Function));
  });

  it('Executes through all install steps', async () => {
    const logger = mocked(Logger, true);
    const oraSucceed = mocked(ora().succeed);

    jest.spyOn(installer, 'install');
    jest.spyOn(logger.prototype, 'error');
    jest.spyOn(logger.prototype, 'warning');

    await installer.install();

    expect(installer.install).toReturnTimes(1);

    expect(logger.prototype.error).toBeCalledTimes(0);
    expect(logger.prototype.warning).toBeCalledTimes(0);

    expect(oraSucceed).toBeCalledTimes(4);
  });
});

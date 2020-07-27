/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import * as i from 'types';
import { mocked } from 'ts-jest/utils';
import ora from 'ora';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import Installer from 'core/Installer';


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
  const ctx = new class {
    /** @TODO Find a way to load installer outside of IoC container */
    installer = container.getNamed<i.InstallerType>(SERVICES.Installer, 'client');

    // Full-Access installer reference for accessing protected/private properties
    FAInstaller = this.installer as any;
  };

  it('Configures the base install steps on init', () => {
    ctx.installer.init();

    expect(ctx.FAInstaller.installStepList).toBeDefined();
    expect(ctx.FAInstaller.installStepList.length).toBeGreaterThan(0);
  });

  it('Executes through all install steps', async () => {
    const oraSucceed = mocked(ora().succeed);
    jest.spyOn(ctx.installer, 'install');

    await ctx.installer.install();

    expect(ctx.installer.install).toReturnTimes(1);
    expect(oraSucceed).toBeCalledTimes(4);
  });
});

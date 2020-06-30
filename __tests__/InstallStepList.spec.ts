import 'reflect-metadata';
import * as i from 'types';
import { mocked } from 'ts-jest/utils';
import InstallStepList from 'src/InstallStepList';
import { INSTALL_STEP } from 'src/constants';
import Logger from '../src/Logger';

jest.mock('../src/Logger', () => {
  return jest.fn();
});

describe('InstallStepList', () => {
  class Ctx {
    readonly logger = mocked(Logger, true);

    createStepList() {
      return new InstallStepList(this.logger.prototype);
    }

    stepOptions(id?: symbol): i.InstallStepOptions {
      return {
        message: {
          pending: 'pending test',
          success: 'success test',
        },
        emoji: '🧪',
        id: id || INSTALL_STEP.CLONE,
        cmd: 'cmd line script',
        fn: async () => void {},
      };
    }
  }

  const ctx = new Ctx();

  it('Is an array', () => {
    expect(Array.isArray(ctx.createStepList())).toBeTruthy();
  });

  it('Starts empty', () => {
    expect(ctx.createStepList()).toHaveLength(0);
  });

  it('Returns the first in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL));

    expect(stepList.first?.hasId('CLONE')).toBeTruthy();
  });

  it('Returns the last in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL));

    expect(stepList.last?.hasId('NPM_INSTALL')).toBeTruthy();
  });

  it('Can add a step to the end of the list', () => {
    // List only has a single entry
    const stepList = ctx.createStepList().add(ctx.stepOptions(INSTALL_STEP.CLONE));

    expect(stepList).toHaveLength(1);
    expect(stepList.first?.previous).toBeUndefined();
    expect(stepList.last?.next).toBeUndefined();

    // Additional steps are added at the end of the list
    stepList.add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL));

    expect(stepList).toHaveLength(2);
    expect(stepList.last?.hasId('NPM_INSTALL')).toBeTruthy();

    // 'previous' and 'next' references are updated
    expect(stepList.last?.previous?.hasId('CLONE')).toBeTruthy();
    expect(stepList.first?.next?.hasId('NPM_INSTALL')).toBeTruthy();
  });

  it('Can add a step at any position in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL))
      .add(ctx.stepOptions(INSTALL_STEP.CLEANUP));

    stepList.addAfterStep('CLONE', ctx.stepOptions(INSTALL_STEP.UPDATE_PACKAGE));

    expect(stepList[1].hasId('UPDATE_PACKAGE')).toBeTruthy();

    // Updates 'previous' and 'next' references of previous and next steps
    expect(stepList[0].previous).toBeUndefined();
    expect(stepList[0].next?.hasId('UPDATE_PACKAGE')).toBeTruthy();
    expect(stepList[1].previous?.hasId('CLONE')).toBeTruthy();
    expect(stepList[1].next?.hasId('NPM_INSTALL')).toBeTruthy();
  });

  it('Modifies a step\'s options and leaves everything intact', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL));

    stepList.modifyStep('CLONE', { cmd: 'modified' });

    const modifiedStepOpts = {
      ...stepList.first?.options,
      cmd: 'modified',
    };

    expect(stepList.first?.options).toMatchObject(modifiedStepOpts);

    /* eslint-disable no-console */
    // Supress console.log output from tests
    const orgLog = console.log;
    console.log = jest.fn();

    // Shows a warning when step is not found
    /** @TODO Fix. Logger mock freezes Jest */
    stepList.modifyStep('CLEANUP', { cmd: 'modified' });

    expect(ctx.logger).toHaveBeenCalledTimes(1);

    console.log = orgLog;
    /* eslint-enable */
  });
});

import 'reflect-metadata';
import * as i from 'types';
import InstallStepList from 'src/InstallStepList';
import { INSTALL_STEP } from 'src/constants';
import Logger from 'src/utils/Logger';
import createCliCtx from './utils/createCliCtx';

describe('InstallStepList', () => {
  const ctx = new class Ctx {
    get logger() {
      const { cliMgr } = createCliCtx();

      return new Logger(cliMgr);
    }

    createStepList() {
      return new InstallStepList(this.logger);
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
  };

  it('Is an array', () => {
    expect(Array.isArray(ctx.createStepList())).toEqual(true);
  });

  it('Starts empty', () => {
    expect(ctx.createStepList()).toHaveLength(0);
  });

  it('Returns the first in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL));

    expect(stepList.first?.hasId('CLONE')).toEqual(true);
  });

  it('Returns the last in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL));

    expect(stepList.last?.hasId('NPM_INSTALL')).toEqual(true);
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
    expect(stepList.last?.hasId('NPM_INSTALL')).toEqual(true);

    // 'previous' and 'next' references are updated
    expect(stepList.last?.previous?.hasId('CLONE')).toEqual(true);
    expect(stepList.first?.next?.hasId('NPM_INSTALL')).toEqual(true);
  });

  it('Can add a step at any position in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions(INSTALL_STEP.CLONE))
      .add(ctx.stepOptions(INSTALL_STEP.NPM_INSTALL))
      .add(ctx.stepOptions(INSTALL_STEP.CLEANUP));

    stepList.addAfterStep('CLONE', ctx.stepOptions(INSTALL_STEP.UPDATE_PACKAGE));

    expect(stepList[1].hasId('UPDATE_PACKAGE')).toEqual(true);

    // Updates 'previous' and 'next' references of previous and next steps
    expect(stepList[0].previous).toBeUndefined();
    expect(stepList[0].next?.hasId('UPDATE_PACKAGE')).toEqual(true);
    expect(stepList[1].previous?.hasId('CLONE')).toEqual(true);
    expect(stepList[1].next?.hasId('NPM_INSTALL')).toEqual(true);
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
  });

  it('Shows a warning when trying to modify a step that is not included', () => {
    const stepList = ctx.createStepList().add(ctx.stepOptions(INSTALL_STEP.CLONE));

    Logger.prototype.warning = jest.fn().mockImplementation();

    // Shows a warning when step is not found
    stepList.modifyStep('NPM_INSTALL', { cmd: 'modified' });

    expect(ctx.logger.warning).toHaveBeenCalledTimes(1);
  });
});

import 'reflect-metadata';
import * as i from 'types';
import InstallStepList from 'src/InstallStepList';
import Logger from 'src/utils/Logger';
import createCliCtx from './utils/createCliCtx';
import mockConsole from './utils/mockConsole';

describe('InstallStepList', () => {
  const restoreConsole = mockConsole();

  const ctx = new class {
    get logger() {
      return new Logger();
    }

    createStepList() {
      const { cliMgr } = createCliCtx();

      return new InstallStepList(this.logger, cliMgr);
    }

    stepOptions(id?: i.InstallStepIds): i.InstallStepOptions {
      return {
        message: {
          pending: 'pending test',
          success: 'success test',
        },
        emoji: '🧪',
        id: id || 'clone',
        cmd: 'cmd line script',
        fn: async () => void {},
      };
    }
  };

  afterAll(() => {
    restoreConsole();
  });

  it('Is an array', () => {
    expect(Array.isArray(ctx.createStepList())).toEqual(true);
  });

  it('Starts empty', () => {
    expect(ctx.createStepList()).toHaveLength(0);
  });

  it('Returns the first in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions('clone'))
      .add(ctx.stepOptions('npmInstall'));

    expect(stepList.first?.id).toEqual('clone');
  });

  it('Returns the last in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions('clone'))
      .add(ctx.stepOptions('npmInstall'));

    expect(stepList.last?.id).toEqual('npmInstall');
  });

  it('Can add a step to the end of the list', () => {
    // List only has a single entry
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions('clone'));

    expect(stepList).toHaveLength(1);
    expect(stepList.first?.previous).toBeUndefined();
    expect(stepList.last?.next).toBeUndefined();

    // Additional steps are added at the end of the list
    stepList.add(ctx.stepOptions('npmInstall'));

    expect(stepList).toHaveLength(2);
    expect(stepList.last?.id).toEqual('npmInstall');

    // 'previous' and 'next' references are updated
    expect(stepList.last?.previous?.id).toEqual('clone');
    expect(stepList.first?.next?.id).toEqual('npmInstall');
  });

  it('Can add a step at any position in the list', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions('clone'))
      .add(ctx.stepOptions('npmInstall'))
      .add(ctx.stepOptions('cleanup'));

    stepList.addAfterStep('clone', ctx.stepOptions('updatePackage'));

    expect(stepList[1].id).toEqual('updatePackage');

    // Updates 'previous' and 'next' references of previous and next steps
    expect(stepList[0].previous).toBeUndefined();
    expect(stepList[0].next?.id).toEqual('updatePackage');
    expect(stepList[1].previous?.id).toEqual('clone');
    expect(stepList[1].next?.id).toEqual('npmInstall');
  });

  it('Modifies a step\'s options and leaves everything intact', () => {
    const stepList = ctx.createStepList()
      .add(ctx.stepOptions('clone'))
      .add(ctx.stepOptions('npmInstall'));

    stepList.modifyStep('clone', { cmd: 'modified' });

    const modifiedStepOpts = {
      ...stepList.first?.options,
      cmd: 'modified',
    };

    expect(stepList.first?.options).toMatchObject(modifiedStepOpts);
  });

  it('Shows a debug msg when trying to modify a step that is not included', () => {
    const { cliMgr, cli } = createCliCtx();

    cli.debug = true;

    const stepList = new InstallStepList(ctx.logger, cliMgr)
      .add(ctx.stepOptions('clone'));
    const debugMock = jest.spyOn(Logger.prototype, 'debug');

    stepList.modifyStep('npmInstall', { cmd: 'modified' });

    expect(debugMock).toHaveBeenCalledTimes(1);
  });
});

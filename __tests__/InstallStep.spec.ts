import 'reflect-metadata';
import * as i from 'types';

import InstallStep from 'core/InstallStep';


describe('InstallStep', () => {
  const ctx = new class {
    readonly opts: i.InstallStepOptions = {
      message: {
        pending: 'pending test',
        success: 'success test',
      },
      emoji: '🧪',
      id: 'clone',
      cmd: 'cmd line script',
    };

    readonly step1 = new InstallStep(this.opts);
    readonly step2 = new InstallStep(this.opts, this.step1);
  };

  it('Returns correct values from getters', () => {
    expect(ctx.step1.cmd).toEqual('cmd line script');
    expect(ctx.step1.message).toEqual({
      pending: '🧪  pending test',
      success: '🧪  success test',
    });
    expect(ctx.step1.options).toEqual(ctx.opts);
  });

  it('Returns the next step', () => {
    expect(ctx.step1.next).toEqual(ctx.step2);
    expect(ctx.step2.next).toBeUndefined();

    const step3 = new InstallStep(ctx.opts, ctx.step2, ctx.step1);

    expect(step3.next).toEqual(ctx.step1);
  });

  it('Returns the previous step', () => {
    expect(ctx.step1.previous).toBeUndefined();
    expect(ctx.step2.previous).toEqual(ctx.step1);

    const step3 = new InstallStep(ctx.opts, ctx.step2, ctx.step1);

    expect(step3.previous).toEqual(ctx.step2);
  });

  it('Modifies a step\'s options and leaves everything intact', () => {
    // With plain object
    const stepOpt = ctx.step1.options;

    let modStep = ctx.step1.modify({ emoji: '😂👌' });

    expect(stepOpt).not.toMatchObject(modStep.options);

    delete modStep.options.emoji;
    expect(stepOpt).toMatchObject(modStep.options);

    // With callback
    const step2Opt = ctx.step2.options;

    modStep = ctx.step2.modify((step) => ({
      emoji: step.options.emoji + '😂👌',
    }));

    expect(step2Opt).not.toMatchObject(modStep.options);

    delete modStep.options.emoji;
    expect(step2Opt).toMatchObject(modStep.options);
  });
});

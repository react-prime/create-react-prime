import * as i from 'types';

import Step from 'core/decorators/Step';
import StepList from 'core/StepList';


describe('StepList', () => {
  // Init list
  @Step({
    name: 'step1',
    spinner: {
      emoji: '🔨',
      message: {
        pending: () => 'testing 1...',
        success: () => 'tested 1!',
      },
    },
  })
  class TestStep1 {
    on = () => void {}
  }

  @Step({
    name: 'step2',
    spinner: {
      emoji: '✏️',
      message: {
        pending: () => 'testing 2...',
        success: () => 'tested 2!',
      },
    },
  })
  class TestStep2 {
    on = () => void {}
  }

  const step1 = new TestStep1() as unknown as i.Step;
  const step2 = new TestStep2() as unknown as i.Step;

  const spy1 = jest.spyOn(step1, 'on');
  const spy2 = jest.spyOn(step2, 'on');
  const installerOptions = { cloneUrl: '', name: 'installer' };

  const stepList = new StepList();
  stepList.push(step1, step2);


  beforeEach(() => {
    spy1.mockClear();
    spy2.mockClear();
  });


  it('Executes all steps in the list', async () => {
    await stepList.execute(installerOptions);

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('Calls the step function with the correct arguments', async () => {
    await stepList.execute(installerOptions);

    expect(spy1).toHaveBeenCalledWith(installerOptions);
    expect(spy2).toHaveBeenCalledWith(installerOptions);
  });
});

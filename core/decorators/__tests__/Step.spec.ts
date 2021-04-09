import * as i from 'types';
// import ora from 'ora';

import Step from 'core/decorators/Step';


// const oraSucceedMock = jest.fn().mockName('succeed');
// const oraStartMock = jest.fn().mockName('start');
// const oraMockConstructor = {
//   start: oraStartMock,
//   succeed: oraSucceedMock,
// };

// jest.mock('ora', () => jest.fn().mockImplementation(() => ({
//   start: oraStartMock,
// })));
// const ora = require('ora');

// jest.mock('ora', jest.fn().mockImplementation(() => oraMockConstructor));
// const ora = require('ora');
// ora.mockImplementation(() => oraMockConstructor);


describe('decorators/Step', () => {
  @Step({
    name: 'test',
    after: 'first-step',
    spinner: {
      emoji: '🧪',
      message: {
        pending: () => 'testing...',
        success: () => 'done',
      },
    },
  })
  class TestStep {
    on = () => void {}
  }

  // const installerOptions: i.InstallStepArgs = {
  //   cloneUrl: '',
  //   name: '',
  // };
  let step: i.Step;

  beforeEach(() => {
    step = new TestStep() as unknown as i.Step;
  });


  it('Receives the step name', () => {
    expect(step.name).toBe('test');
  });

  it('Receives the "after" step name', () => {
    expect(step.after).toBe('first-step');
  });

  // TODO: Figure out how to properly mock Ora
  // it('Starts the spinner', async () => {
  //   step.on(installerOptions);

  //   expect(oraStartMock).toHaveBeenCalled();
  // });
});

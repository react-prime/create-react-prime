import * as i from 'types';
import os from 'os';
// @ts-ignore
import { expectPrompts } from 'inquirer';

import Question from 'core/decorators/Question';
import Prompt from 'core/Prompt';


jest.mock('os');

// Type cast as mocked
const osMock = os as jest.Mocked<typeof os>;

// Supress console.log output from tests
/* eslint-disable no-console */
const orgLog = console.log;

function mockConsole(): () => void {
  console.log = jest.fn();

  return function restoreConsole() {
    console.log = orgLog;
  };
}
/* eslint-enable */


describe('Prompt', () => {
  const restoreConsole = mockConsole();
  const logSpy = jest.spyOn(console, 'log');
  let prompt: Prompt;


  beforeEach(() => {
    logSpy.mockClear();

    @Question({
      name: 'boilerplate',
      type: 'list',
      choices: [
        { name: 'react-web', value: 'react-web' },
        { name: 'react-mobile', value: 'react-mobile' },
      ],
      beforeInstall: true,
    })
    class TestQuestion1 {
      answer = () => {
        return;
      }
    }

    @Question({
      name: 'projectname',
      type: 'input',
      afterInstall: true,
    })
    class TestQuestion2 {
      answer = () => {
        // eslint-disable-next-line no-console
        console.log(1);
      }
    }

    prompt = new Prompt([TestQuestion1 as i.Newable, TestQuestion2 as i.Newable]);
  });

  afterAll(() => {
    restoreConsole();
  });


  it('Asks the before install question and returns the given answer', async () => {
    expectPrompts([{
      choices: ['react-web', 'react-mobile'],
      choose: 0,
    }]);

    const answers = await prompt.ask('before');
    expect(answers).toEqual({
      boilerplate: 'react-web',
    });
  });

  it('Asks the after install question and returns the given answer', async () => {
    expectPrompts([{
      input: 'projectname',
    }]);

    const answers = await prompt.ask('after');
    expect(answers).toEqual({
      projectname: 'projectname',
    });
  });

  it('Executes the answer method of a question', async () => {
    expectPrompts([{
      input: 'projectname',
    }]);

    await prompt.ask('after');

    expect(logSpy.mock.calls).toEqual([[1]]);
  });

  it('Excludes a question if current system does not equal question OS', async () => {
    expectPrompts([{
      input: 'os',
    }]);

    const mock = jest.fn();
    mock.mockReturnValue('Linux');

    const orgTypeFn = osMock.type;
    osMock.type = mock;

    @Question({
      name: 'os',
      type: 'input',
      OS: ['mac'],
      beforeInstall: true,
    })
    class TestQuestion {
      answer = () => void {}
    }

    prompt = new Prompt([TestQuestion as i.Newable]);
    const answers = await prompt.ask('before');

    expect(answers).toEqual({});

    osMock.type = orgTypeFn;
  });

  it('Includes a question if current system does equal question OS', async () => {
    expectPrompts([{
      input: 'os',
    }]);

    const mock = jest.fn();
    mock.mockReturnValue('Linux');

    const orgTypeFn = osMock.type;
    osMock.type = mock;

    @Question({
      name: 'os',
      type: 'input',
      OS: ['linux'],
      beforeInstall: true,
    })
    class TestQuestion {
      answer = () => void {}
    }

    prompt = new Prompt([TestQuestion as i.Newable]);
    const answers = await prompt.ask('before');

    expect(answers).toEqual({
      os: 'os',
    });

    osMock.type = orgTypeFn;
  });
});

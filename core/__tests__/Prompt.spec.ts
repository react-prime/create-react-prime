/* eslint-disable no-console */
import * as i from 'types';
// @ts-ignore
import { expectPrompts } from 'inquirer';

import Question from 'core/decorators/Question';
import Prompt from 'core/Prompt';


// Supress console.log output from tests
const orgLog = console.log;

function mockConsole(): () => void {
  console.log = jest.fn();

  return function restoreConsole() {
    console.log = orgLog;
  };
}


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
        { name: 'react-spa', value: 'react-spa' },
        { name: 'react-ssr', value: 'react-ssr' },
      ],
    })
    class TestQuestion1 {
      answer = () => {
        return;
      }
    }

    @Question({
      name: 'projectname',
      type: 'input',
    })
    class TestQuestion2 {
      answer = () => {
        console.log(1);
      }
    }

    prompt = new Prompt({
      before: [TestQuestion1 as i.Newable],
      after: [TestQuestion2 as i.Newable],
    });
  });

  afterAll(() => {
    restoreConsole();
  });


  it('Asks the before install question and returns the given answer', async () => {
    expectPrompts([{
      choices: ['react-spa', 'react-ssr'],
      choose: 0,
    }]);

    const answers = await prompt.ask('before');
    expect(answers).toEqual({
      boilerplate: 'react-spa',
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

    // I guess the mock also executes the answer method???
    expect(logSpy.mock.calls).toEqual([[1], [1]]);
  });
});

import * as i from 'types';
import { Answers } from 'inquirer';
import color from 'kleur';

import CRPApp from 'core/CRPApp';
import { cliAPI__DO_NOT_USE__ } from 'core/CLIMgr';
import StepList from 'core/StepList';
import Installer from 'core/decorators/Installer';
import Step from 'core/decorators/Step';
import { LOG_PREFIX } from 'core/constants';

import ReactWebInstaller from 'modules/react-web/ReactSPA.installer';
import { CloneStep } from 'modules/defaults/steps';


/* eslint-disable no-console */
// Supress console.log output from tests
const orgLog = console.log;

function mockConsole(): () => void {
  console.log = jest.fn();

  return function restoreConsole() {
    console.log = orgLog;
  };
}
/* eslint-enable */

const orgEnv = process.env;


describe('CRPApp', () => {
  const restoreConsole = mockConsole();
  const logSpy = jest.spyOn(console, 'log');
  let app: CRPApp;

  beforeEach(() => {
    app = new CRPApp();
  });

  afterAll(() => {
    restoreConsole();
    process.env = orgEnv;
  });

  it('Gets the correct installer', () => {
    // Simulate user input (node dist/main.js doesnt actually do anything here)
    function parse(...str: string[]) {
      cliAPI__DO_NOT_USE__.parse(['node', 'dist/main.js', ...str]);
    }

    const name = 'react-web';
    parse('-b', name);

    app.installers = [ReactWebInstaller];

    expect(app.getInstaller()?.options.name).toEqual(name);
  });

  it('Generates a correct step list', () => {
    const spinner: i.SpinnerOptions = {
      emoji: '🧪',
      message: {
        pending: () => 'pending',
        success: () => 'success',
      },
    };

    @Step({
      name: 'step1',
      spinner,
    })
    class TestStep1 {
      on = () => void {};
    }

    @Step({
      name: 'step2',
      spinner,
    })
    class TestStep2 {
      on = () => void {};

      when = (answers: Answers) => {
        return answers.testQuestion === true;
      }
    }

    @Installer({
      name: 'test',
      cloneUrl: '',
      steps: [TestStep1, TestStep2],
    })
    class TestInstaller {}

    app.defaults.steps = [CloneStep];

    const stepList = app.generateStepList(new TestInstaller() as i.Installer, {
      testQuestion: false,
    });

    const equalList = new StepList();
    equalList.push(
      // Decorator type issue
      new CloneStep() as unknown as i.Step,
      new TestStep1() as unknown as i.Step,
    );

    // Deep equal does not work for some reason
    expect(JSON.stringify(stepList)).toBe(JSON.stringify(equalList));
  });

  it('Prints the correct startup message', () => {
    const name = 'create-react-prime';
    const v = '2.0.0';
    process.env.NAME = name;
    process.env.VERSION = v;

    app.startMessage();

    const text = [
      LOG_PREFIX,
      '⚡️',
      color.yellow().bold(name),
      `v${v}`,
      color.dim('(ctrl + c to exit)'),
    ].join(' ');
    const whitespace: string[] = [];

    expect(logSpy.mock.calls).toEqual([[text], whitespace]);
  });
});

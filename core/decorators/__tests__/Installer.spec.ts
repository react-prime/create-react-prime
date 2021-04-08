import * as i from 'types';
import Installer from 'core/decorators/Installer';
import Step from 'core/decorators/Step';
import Question from 'core/decorators/Question';


describe('decorators/Installer', () => {
  @Step({
    name: 'step',
    spinner: {} as i.SpinnerOptions, // Don't care for in these tests
  })
  class TestStep {
    on = () => void {}
  }

  @Question({
    type: 'input',
    name: 'before',
    beforeInstall: true,
  })
  class TestQuestionBefore {
    answer = () => void {}
  }

  @Question({
    type: 'list',
    name: 'after',
    choices: ['1', '2'],
    afterInstall: true,
  })
  class TestQuestionAfter {
    answer = () => void {}
  }

  const options: i.InstallerOptions = {
    cloneUrl: 'https://test.com/',
    name: 'test',
    questions: [TestQuestionBefore, TestQuestionAfter],
    steps: [TestStep],
  };
  let installer: i.Installer;

  beforeEach(() => {
    @Installer(options)
    class TestInstaller {}

    installer = new TestInstaller() as i.Installer;
  });

  it('Decorates a class with the correct options', () => {
    expect(installer.options).toBeDefined();
    expect(installer.options.cloneUrl).toBe('https://test.com/');
    expect(installer.options.name).toBe('test');
    // Make sure these properties are not leaked into options
    expect((installer.options as Record<string, unknown>).questions).toBeUndefined();
    expect((installer.options as Record<string, unknown>).steps).toBeUndefined();
  });

  it('Decorates a class with the correct steps', () => {
    expect(installer.steps).toBeDefined();
    expect(installer.steps[0]).toEqual(TestStep);
  });

  it('Decorates a class with the correct questions', () => {
    expect(installer.questions).toBeDefined();
    expect(installer.questions?.before).toBeDefined();
    expect(installer.questions?.after).toBeDefined();
    expect(installer.questions?.before[0]).toEqual(TestQuestionBefore);
    expect(installer.questions?.after[0]).toEqual(TestQuestionAfter);
  });
});

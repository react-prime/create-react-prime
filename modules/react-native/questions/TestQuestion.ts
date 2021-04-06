import Question from 'core/decorators/Question';


@Question({
  type: 'input',
  name: 'test',
  message: 'Test',
  beforeInstall: true,
})
class TestQuestion {
  answer = (): void => {
    return;
  }
}

export default TestQuestion;

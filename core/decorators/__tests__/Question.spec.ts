import * as i from 'types';
import { ListQuestion } from 'inquirer';

import Question from 'core/decorators/Question';


describe('decorators/Question', () => {
  @Question({
    type: 'input',
    name: 'before',
    beforeInstall: true,
    OS: ['mac'],
  })
  class TestQuestionBefore {
    answer = () => void {}
    when = () => { return true; }
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

  it('Has the question options', () => {
    let q = new TestQuestionBefore() as unknown as i.Question;

    expect(q.options).toBeDefined();
    expect(q.options.type).toBe('input');
    expect(q.options.name).toBe('before');
    expect(q.options.beforeInstall).toBe(true);
    expect(q.options.OS).toEqual(['mac']);

    q = new TestQuestionAfter() as unknown as i.Question;

    expect(q.options).toBeDefined();
    expect(q.options.type).toBe('list');
    expect(q.options.name).toBe('after');
    expect((q.options as ListQuestion).choices).toEqual(['1', '2']);
    expect(q.options.afterInstall).toBe(true);
    expect(q.options.OS).toBeUndefined();
  });

  it('Adds any function method to the options', () => {
    const q = new TestQuestionBefore() as unknown as i.Question;

    expect(q.options.when).toBeDefined();
    expect(typeof q.options.when).toBe('function');
  });
});

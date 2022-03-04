import inquirer from 'inquirer';

import { checkboxQuestion, listQuestion, question } from '../templates';

describe('Question templates', () => {
  const promptSpy = vi
    .spyOn(inquirer, 'prompt')
    .mockResolvedValue({ foo: 'bar' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('question', () => {
    const options = { name: 'foo' };

    it('Runs a basic question prompt', async () => {
      await question(options);

      expect(promptSpy).toHaveBeenCalled();
    });

    it('Returns the answer', async () => {
      const answer = await question(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual('bar');
    });
  });

  describe('checkboxQuestion', () => {
    const options = {
      name: 'foo',
      choices: [
        { name: 'foo', value: 'foo' },
        { name: 'bar', value: 'bar' },
      ],
    };

    it('Runs a checkbox question prompt', async () => {
      await checkboxQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
    });

    it('Returns a single answer as object', async () => {
      const choice = [{ name: 'foo', value: 'foo' }];
      const promptSpy = vi
        .spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ foo: choice });

      const answer = await checkboxQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual(choice);
    });

    it('Returns a single answer as primitive', async () => {
      const choice = ['foo'];
      const promptSpy = vi
        .spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ foo: choice });

      const answer = await checkboxQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual(choice);
    });

    it('Returns multiple answers', async () => {
      const choice = [
        { name: 'foo', value: 'foo' },
        { name: 'bar', value: 'bar' },
      ];
      const promptSpy = vi
        .spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ foo: choice });

      const answer = await checkboxQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual(choice);
    });

    it('Returns null if nothing was chosen', async () => {
      const choice = null;
      const promptSpy = vi
        .spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ foo: choice });

      const answer = await checkboxQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual(choice);
    });
  });

  describe('listQuestion', () => {
    const options = {
      name: 'foo',
      choices: [
        { name: 'foo', value: 'foo' },
        { name: 'bar', value: 'bar' },
      ],
    };

    it('Runs a list question prompt', async () => {
      await listQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
    });

    it('Returns the answer as object', async () => {
      const choice = { name: 'foo', value: 'foo' };
      const promptSpy = vi
        .spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ foo: choice });

      const answer = await listQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual(choice);
    });

    it('Returns the answer as primitive', async () => {
      const choice = 'foo';
      const promptSpy = vi
        .spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ foo: choice });

      const answer = await listQuestion(options);

      expect(promptSpy).toHaveBeenCalled();
      expect(answer).toEqual(choice);
    });
  });
});

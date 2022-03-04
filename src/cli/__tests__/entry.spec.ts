import { getActionForOption } from '../actions/entry';
import * as question from '../../modules/questions';

describe('Entry', () => {
  it('Finds the entry point of a given option', async () => {
    const action = await getActionForOption({ boilerplate: true });
    expect(action).toBeDefined();
  });

  it('Prompts for entry point if entry point is not found', async () => {
    const promptSpy = vi
      .spyOn(question, 'entry')
      .mockResolvedValue('boilerplate');

    let action = await getActionForOption({});

    expect(action).toBeDefined();
    expect(promptSpy).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    action = await getActionForOption({ foo: true });

    expect(action).toBeDefined();
    expect(promptSpy).toHaveBeenCalledTimes(2);
  });

  it('Exits if user chooses to exit', async () => {
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce(() => void 0 as never);
    const promptSpy = vi
      .spyOn(question, 'entry')
      .mockImplementationOnce(() => Promise.resolve(null));

    const action = await getActionForOption({});

    expect(action).toBeDefined();
    expect(promptSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalled();
  });
});

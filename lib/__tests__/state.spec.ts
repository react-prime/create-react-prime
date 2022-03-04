import type * as i from 'types';
import { createState } from '@crp';

describe('State', () => {
  let state: i.State;

  beforeEach(() => {
    state = createState();
  });

  it('Gets the data from state', () => {
    expect(state.answers).toStrictEqual({});
  });

  it('Starts with the correct default state', () => {
    // This should error if we add more keys to the state
    expect(Object.keys(state).length).toEqual(2);
  });

  it('Stores data to state (sync)', () => {
    expect(state.answers).toStrictEqual({});

    state.answers.boilerplate = 'foo';

    expect(state.answers).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    state.foo = 'bar';
    // @ts-expect-error
    expect(state.foo).toEqual('bar');
  });

  it('Stores data to state (async)', async () => {
    expect(state.answers).toStrictEqual({});

    state.answers.boilerplate = await Promise.resolve('foo');

    expect(state.answers).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    state.foo = await Promise.resolve('bar');
    // @ts-expect-error
    expect(state.foo).toEqual('bar');
  });

  it('Exits if important state values are not found with proxy', () => {
    vi.spyOn(console, 'log').mockImplementation(() => void 0);
    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => 0 as never);

    expect(state.answers.projectName).toEqual(undefined);

    process.nextTick(() => {
      expect(exitMock).toHaveBeenCalledWith(1);
    });
  });
});

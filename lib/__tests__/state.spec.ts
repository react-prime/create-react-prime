import type * as i from 'types';
import { spyOn } from 'vitest';
import { createState } from '@crp';


describe('State', () => {
  let _state: i.State;

  beforeEach(() => {
    _state = createState();
  });

  it('Gets the data from state', () => {
    expect(_state.answers).toStrictEqual({});
  });

  it('Starts with the correct default state', () => {
    // This should error if we add more keys to the state
    expect(Object.keys(_state).length).toEqual(1);

    let key: i.StateKeys;
    for (key in _state) {
      expect(_state[key]).toStrictEqual({});
    }
  });

  it('Stores data to state (sync)', () => {
    expect(_state.answers).toStrictEqual({});

    _state.answers.boilerplate = 'foo';

    expect(_state.answers).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    _state.foo = 'bar';
    // @ts-expect-error
    expect(_state.foo).toEqual('bar');
  });

  it('Stores data to state (async)', async () => {
    expect(_state.answers).toStrictEqual({});

    _state.answers.boilerplate = await Promise.resolve('foo');

    expect(_state.answers).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    _state.foo = await Promise.resolve('bar');
    // @ts-expect-error
    expect(_state.foo).toEqual('bar');
  });

  it('Exits if important state values are not found with proxy', () => {
    // @ts-ignore
    const exitMock = spyOn(process, 'exit').mockImplementationOnce(() => void {});
    spyOn(console, 'log').mockImplementationOnce(() => void {});
    expect(_state.answers.projectName).toEqual(undefined);
    expect(exitMock).toBeCalled();
  });
});
